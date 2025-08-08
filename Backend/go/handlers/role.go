package handlers

import (
    "auth-service/models"
    "context"
    "encoding/json"
    "net/http"

    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type RoleHandler struct {
    collection *mongo.Collection
}

func NewRoleHandler(collection *mongo.Collection) *RoleHandler {
    return &RoleHandler{collection: collection}
}

func (h *RoleHandler) CreateRole(w http.ResponseWriter, r *http.Request) {
    var role models.Role
    if err := json.NewDecoder(r.Body).Decode(&role); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Validar datos del rol
    if role.Name == "" {
        http.Error(w, "Role name is required", http.StatusBadRequest)
        return
    }

    // Insertar rol
    result, err := h.collection.InsertOne(context.Background(), role)
    if err != nil {
        http.Error(w, "Error creating role", http.StatusInternalServerError)
        return
    }

    role.ID = result.InsertedID.(primitive.ObjectID)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(role)
}

func (h *RoleHandler) GetRoles(w http.ResponseWriter, r *http.Request) {
    cursor, err := h.collection.Find(context.Background(), bson.M{})
    if err != nil {
        http.Error(w, "Error fetching roles", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.Background())

    var roles []models.Role
    if err = cursor.All(context.Background(), &roles); err != nil {
        http.Error(w, "Error reading roles", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(roles)
}

func (h *RoleHandler) UpdateRole(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    roleID, err := primitive.ObjectIDFromHex(params["id"])
    if err != nil {
        http.Error(w, "Invalid role ID", http.StatusBadRequest)
        return
    }

    var updatedRole models.Role
    if err := json.NewDecoder(r.Body).Decode(&updatedRole); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Actualizar rol
    _, err = h.collection.UpdateOne(
        context.Background(),
        bson.M{"_id": roleID},
        bson.M{"$set": bson.M{
            "name":        updatedRole.Name,
            "permissions": updatedRole.Permissions,
        }},
    )

    if err != nil {
        http.Error(w, "Error updating role", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Role updated"})
}

func (h *RoleHandler) DeleteRole(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    roleID, err := primitive.ObjectIDFromHex(params["id"])
    if err != nil {
        http.Error(w, "Invalid role ID", http.StatusBadRequest)
        return
    }

    // Verificar si el rol está en uso
    usersCollection := h.collection.Database().Collection("users")
    count, err := usersCollection.CountDocuments(
        context.Background(),
        bson.M{"role_id": roleID},
    )

    if err != nil {
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }

    if count > 0 {
        http.Error(w, "Cannot delete role assigned to users", http.StatusBadRequest)
        return
    }

    // Eliminar rol
    _, err = h.collection.DeleteOne(context.Background(), bson.M{"_id": roleID})
    if err != nil {
        http.Error(w, "Error deleting role", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Role deleted"})
}