package main

import (
	"auth-service/handlers"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Cargar variables de entorno
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error cargando .env")
	}

	router := mux.NewRouter()

	// Endpoints
	router.HandleFunc("/register", handlers.Register).Methods("POST")
	router.HandleFunc("/login", handlers.Login).Methods("POST")

	log.Println("Servidor iniciado en :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}