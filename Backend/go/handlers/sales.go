package handlers

import (
    "auth-service/models"
    "context"
    "encoding/json"
    "net/http"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type SalesHandler struct {
    collection *mongo.Collection
}

func NewSalesHandler(collection *mongo.Collection) *SalesHandler {
    return &SalesHandler{collection: collection}
}

func (h *SalesHandler) CreateSale(w http.ResponseWriter, r *http.Request) {
    token := r.Context().Value("token").(*jwt.Token)
    claims := token.Claims.(jwt.MapClaims)
    userRole := claims["role"].(string)

    if userRole != "vendedor" {
        http.Error(w, "Only sellers can create sales", http.StatusForbidden)
        return
    }

    var sale models.Sale
    if err := json.NewDecoder(r.Body).Decode(&sale); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Validate sale data
    if sale.Product == "" || sale.Quantity <= 0 || sale.Amount <= 0 {
        http.Error(w, "Invalid sale data", http.StatusBadRequest)
        return
    }

    // Complete sale data
    sale.Seller = claims["sub"].(string)
    sale.Timestamp = time.Now().Unix()

    // Insert sale
    result, err := h.collection.InsertOne(context.Background(), sale)
    if err != nil {
        http.Error(w, "Error creating sale", http.StatusInternalServerError)
        return
    }

    sale.ID = result.InsertedID.(primitive.ObjectID)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(sale)
}

func (h *SalesHandler) GetSalesReport(w http.ResponseWriter, r *http.Request) {
    token := r.Context().Value("token").(*jwt.Token)
    claims := token.Claims.(jwt.MapClaims)
    userRole := claims["role"].(string)

    if userRole != "consultor" {
        http.Error(w, "Only consultants can generate reports", http.StatusForbidden)
        return
    }

    // Get date parameters
    startDateStr := r.URL.Query().Get("start")
    endDateStr := r.URL.Query().Get("end")

    var filter bson.M = bson.M{}

    // Date filtering
    if startDateStr != "" && endDateStr != "" {
        startDate, err := time.Parse("2006-01-02", startDateStr)
        if err != nil {
            http.Error(w, "Invalid start date format (use YYYY-MM-DD)", http.StatusBadRequest)
            return
        }

        endDate, err := time.Parse("2006-01-02", endDateStr)
        if err != nil {
            http.Error(w, "Invalid end date format (use YYYY-MM-DD)", http.StatusBadRequest)
            return
        }

        // Adjust end date to include entire day
        endDate = endDate.Add(24 * time.Hour)

        filter = bson.M{
            "timestamp": bson.M{
                "$gte": startDate.Unix(),
                "$lt":  endDate.Unix(),
            },
        }
    }

    cursor, err := h.collection.Find(context.Background(), filter)
    if err != nil {
        http.Error(w, "Error fetching sales", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.Background())

    var sales []models.Sale
    if err = cursor.All(context.Background(), &sales); err != nil {
        http.Error(w, "Error reading sales data", http.StatusInternalServerError)
        return
    }

    // Calculate totals
    totalSales := len(sales)
    totalAmount := 0.0
    for _, sale := range sales {
        totalAmount += sale.Amount
    }

    // Create response
    response := struct {
        TotalSales  int           `json:"total_sales"`
        TotalAmount float64       `json:"total_amount"`
        Sales       []models.Sale `json:"sales"`
    }{
        TotalSales:  totalSales,
        TotalAmount: totalAmount,
        Sales:       sales,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}