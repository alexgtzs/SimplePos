package handlers

import (
	"auth-service/models"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	collection *mongo.Collection
}

func NewUserHandler(collection *mongo.Collection) *UserHandler {
	return &UserHandler{collection: collection}
}

// ListUsersHandler maneja la solicitud GET para listar usuarios
func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := h.collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Error fetching users: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		http.Error(w, "Error reading users: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Obtener la colección de roles
	rolesCollection := h.collection.Database().Collection("roles")
	
	// Crear un slice para la respuesta
	type UserResponse struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	}
	
	var response []UserResponse

	for _, user := range users {
		// Obtener el nombre del rol
		var role models.Role
		err := rolesCollection.FindOne(ctx, bson.M{"_id": user.RoleID}).Decode(&role)
		roleName := "unknown"
		if err == nil {
			roleName = role.Name
		} else {
			log.Printf("Error getting role name for user %s: %v", user.Email, err)
		}

		response = append(response, UserResponse{
			ID:    user.ID.Hex(),
			Name:  user.Name,
			Email: user.Email,
			Role:  roleName,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetUserHandler maneja la solicitud GET para obtener un usuario
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = h.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Obtener nombre del rol
	rolesCollection := h.collection.Database().Collection("roles")
	var role models.Role
	err = rolesCollection.FindOne(ctx, bson.M{"_id": user.RoleID}).Decode(&role)
	roleName := "unknown"
	if err == nil {
		roleName = role.Name
	}

	// Respuesta sin contraseña
	response := struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	}{
		ID:    user.ID.Hex(),
		Name:  user.Name,
		Email: user.Email,
		Role:  roleName,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// CreateUserHandler maneja la creación de usuarios por administradores
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var newUser struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		RoleName string `json:"role_name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validar campos requeridos
	if newUser.Name == "" || newUser.Email == "" || newUser.Password == "" || newUser.RoleName == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Obtener el rol por nombre
	rolesCollection := h.collection.Database().Collection("roles")
	var role models.Role
	err := rolesCollection.FindOne(context.Background(), bson.M{"name": newUser.RoleName}).Decode(&role)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Invalid role", http.StatusBadRequest)
			return
		}
		http.Error(w, "Error validating role", http.StatusInternalServerError)
		return
	}

	// Verificar si el usuario ya existe
	var existingUser models.User
	err = h.collection.FindOne(context.Background(), bson.M{"email": newUser.Email}).Decode(&existingUser)
	if err == nil {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	} else if err != mongo.ErrNoDocuments {
		http.Error(w, "Error checking user existence", http.StatusInternalServerError)
		return
	}

	// Hash de la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Name:     newUser.Name,
		Email:    newUser.Email,
		Password: string(hashedPassword),
		RoleID:   role.ID,
	}

	// Insertar usuario
	result, err := h.collection.InsertOne(context.Background(), user)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	user.ID = result.InsertedID.(primitive.ObjectID)

	// Respuesta sin contraseña
	response := struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	}{
		ID:    user.ID.Hex(),
		Name:  user.Name,
		Email: user.Email,
		Role:  role.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// UpdateUserHandler maneja la actualización de usuarios
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var updateData struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		RoleName string `json:"role_name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Obtener el usuario existente
	ctx := context.Background()
	var existingUser models.User
	err = h.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&existingUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching user", http.StatusInternalServerError)
		return
	}

	// Obtener el nuevo rol si se proporcionó
	var roleID primitive.ObjectID
	if updateData.RoleName != "" {
		rolesCollection := h.collection.Database().Collection("roles")
		var role models.Role
		err := rolesCollection.FindOne(ctx, bson.M{"name": updateData.RoleName}).Decode(&role)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, "Invalid role", http.StatusBadRequest)
				return
			}
			http.Error(w, "Error validating role", http.StatusInternalServerError)
			return
		}
		roleID = role.ID
	} else {
		roleID = existingUser.RoleID
	}

	// Preparar la actualización
	update := bson.M{
		"$set": bson.M{
			"name":    updateData.Name,
			"email":   updateData.Email,
			"role_id": roleID,
		},
	}

	// Actualizar en la base de datos
	_, err = h.collection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		update,
	)
	if err != nil {
		http.Error(w, "Error updating user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Obtener nombre del nuevo rol para la respuesta
	rolesCollection := h.collection.Database().Collection("roles")
	var role models.Role
	err = rolesCollection.FindOne(ctx, bson.M{"_id": roleID}).Decode(&role)
	roleName := "unknown"
	if err == nil {
		roleName = role.Name
	}

	response := struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	}{
		ID:    userID.Hex(),
		Name:  updateData.Name,
		Email: updateData.Email,
		Role:  roleName,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteUserHandler maneja la eliminación de usuarios
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verificar que el usuario existe
	var user models.User
	err = h.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching user", http.StatusInternalServerError)
		return
	}

	// Eliminar el usuario
	_, err = h.collection.DeleteOne(ctx, bson.M{"_id": userID})
	if err != nil {
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}