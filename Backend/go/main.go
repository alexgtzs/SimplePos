package main

import (
	"auth-service/handlers"
	"auth-service/middleware"
	"auth-service/models"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("Warning: .env file not found, using system environment variables")
    }

    // Get server configuration
    host := getEnv("SERVER_HOST", "localhost")
    port := getEnv("SERVER_PORT", "8080")
    serverAddress := host + ":" + port

    // Connect to MongoDB
    clientOptions := options.Client().ApplyURI(os.Getenv("MONGO_URI"))
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal("MongoDB connection error: ", err)
    }
    defer client.Disconnect(context.Background())

    // Verify connection
    err = client.Ping(context.Background(), nil)
    if err != nil {
        log.Fatal("MongoDB ping failed: ", err)
    }
    log.Println("✅ Connected to MongoDB!")

    db := client.Database(os.Getenv("DB_NAME"))

    // Initialize database (create collections and admin user)
    if err := initDatabase(db); err != nil {
        log.Fatal("Database initialization failed: ", err)
    }

    // Initialize handlers
    authHandler := handlers.NewAuthHandler(db.Collection("users"))
    salesHandler := handlers.NewSalesHandler(db.Collection("sales"))
    roleHandler := handlers.NewRoleHandler(db.Collection("roles"))

    // Setup router
    router := mux.NewRouter()

    // Public routes
    router.HandleFunc("/login", authHandler.Login).Methods("POST", "OPTIONS")
    router.HandleFunc("/register", authHandler.Register).Methods("POST", "OPTIONS")

    // Protected routes
    authRouter := router.PathPrefix("/").Subrouter()
    authRouter.Use(middleware.AuthMiddleware)

    // Sales routes
    authRouter.HandleFunc("/sales", salesHandler.CreateSale).Methods("POST", "OPTIONS")
    authRouter.HandleFunc("/reports/sales", salesHandler.GetSalesReport).Methods("GET", "OPTIONS")

    // Admin routes
    adminRouter := authRouter.PathPrefix("/admin").Subrouter()
    adminRouter.Use(middleware.RoleMiddleware("admin"))
    adminRouter.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"message": "Admin dashboard"})
    }).Methods("GET", "OPTIONS")

    // Role management endpoints
    adminRouter.HandleFunc("/roles", roleHandler.CreateRole).Methods("POST", "OPTIONS")
    adminRouter.HandleFunc("/roles", roleHandler.GetRoles).Methods("GET", "OPTIONS")
    adminRouter.HandleFunc("/roles/{id}", roleHandler.UpdateRole).Methods("PUT", "OPTIONS")
    adminRouter.HandleFunc("/roles/{id}", roleHandler.DeleteRole).Methods("DELETE", "OPTIONS")

    // Configure CORS
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"*"},
        AllowCredentials: true,
        Debug:            true,
    })

    // Wrap the router with the CORS middleware
    handler := c.Handler(router)

    // Start server with clear URL information
    log.Println("🚀 Server starting at http://" + serverAddress)
    log.Printf("📌 Available endpoints:")
    log.Printf("   - POST   http://%s/register", serverAddress)
    log.Printf("   - POST   http://%s/login", serverAddress)
    log.Printf("   - POST   http://%s/sales (Requires VENDEDOR role)", serverAddress)
    log.Printf("   - GET    http://%s/reports/sales (Requires CONSULTOR role)", serverAddress)
    log.Printf("   - GET    http://%s/admin/users (Requires ADMIN role)", serverAddress)
    log.Printf("   - POST   http://%s/admin/roles (Requires ADMIN role)", serverAddress)
    log.Printf("   - GET    http://%s/admin/roles (Requires ADMIN role)", serverAddress)
    log.Printf("   - PUT    http://%s/admin/roles/{id} (Requires ADMIN role)", serverAddress)
    log.Printf("   - DELETE http://%s/admin/roles/{id} (Requires ADMIN role)", serverAddress)
    log.Println("🔒 Protected endpoints require JWT in Authorization header")

    if err := http.ListenAndServe(serverAddress, handler); err != nil {
        log.Fatal("Server failed to start: ", err)
    }
}

// Helper function to get environment variables with default values
func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}

// Función para inicializar la base de datos
func initDatabase(db *mongo.Database) error {
    ctx := context.Background()

    // Crear colecciones si no existen
    collections := []string{"users", "sales", "roles"}
    for _, collName := range collections {
        err := db.CreateCollection(ctx, collName)
        if err != nil {
            // Ignorar error si la colección ya existe (código 48)
            if cmdErr, ok := err.(mongo.CommandError); ok && cmdErr.Code == 48 {
                log.Printf("✅ Collection already exists: %s", collName)
                continue
            }
            return err
        }
        log.Printf("✅ Created collection: %s", collName)
    }

    rolesCollection := db.Collection("roles")
    usersCollection := db.Collection("users")

    // Insertar roles básicos si no existen
    basicRoles := []models.Role{
        {
            Name:        "admin",
            Permissions: []string{"manage_users", "view_reports", "create_sale"},
        },
        {
            Name:        "vendedor",
            Permissions: []string{"create_sale"},
        },
        {
            Name:        "consultor",
            Permissions: []string{"view_reports"},
        },
    }

    rolesMap := make(map[string]primitive.ObjectID)
    for _, role := range basicRoles {
        var existingRole models.Role
        err := rolesCollection.FindOne(ctx, bson.M{"name": role.Name}).Decode(&existingRole)

        if err == mongo.ErrNoDocuments {
            res, err := rolesCollection.InsertOne(ctx, role)
            if err != nil {
                return err
            }
            roleID := res.InsertedID.(primitive.ObjectID)
            rolesMap[role.Name] = roleID
            log.Printf("✅ Created role: %s", role.Name)
        } else if err != nil {
            return err
        } else {
            rolesMap[role.Name] = existingRole.ID
        }
    }

    // Crear usuario admin si no existe
    adminEmail := os.Getenv("ADMIN_EMAIL")
    if adminEmail == "" {
        adminEmail = "admin@system.com"
    }

    adminPassword := os.Getenv("ADMIN_PASSWORD")
    if adminPassword == "" {
        adminPassword = "AdminPassword123"
    }

    var existingUser models.User
    err := usersCollection.FindOne(ctx, bson.M{"email": adminEmail}).Decode(&existingUser)

    if err == mongo.ErrNoDocuments {
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
        if err != nil {
            return err
        }

        adminUser := models.User{
            Name:     "System Admin",
            Email:    adminEmail,
            Password: string(hashedPassword),
            RoleID:   rolesMap["admin"],
        }

        _, err = usersCollection.InsertOne(ctx, adminUser)
        if err != nil {
            return err
        }
        log.Printf("✅ Created admin user: %s", adminEmail)
    } else if err != nil {
        return err
    } else {
        log.Printf("✅ Admin user already exists: %s", adminEmail)
    }

    return nil
}