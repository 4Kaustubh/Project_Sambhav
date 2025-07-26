package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type apiConfig struct {
	port string
}

// var videoThumbnails = map[uuid.UUID]thumbnail{}

func main() {
	godotenv.Load(".env")
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	cfg := apiConfig{
		port: port,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/arguments", cfg.GetArguments)
	mux.HandleFunc("POST /api/recommend", cfg.GetRecommendation)
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(mux)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	log.Printf("Serving on: http://localhost:%s/app/\n", port)
	log.Fatal(srv.ListenAndServe())
}

func recommendHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		// Handle recommendation logic here
		fmt.Fprintln(w, "Recommendation received")
	} else {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
	}
}
