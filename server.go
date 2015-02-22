package main

import (
	"cssc/api"
	"cssc/config"
	"cssc/handlers"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
	"net/http"
)

func main() {
	db, err := openDatabase()

	if err != nil {
		log.Fatalf("Could not open database. %s", err)
	}

	startServer(db)
}

func openDatabase() (*sqlx.DB, error) {
	drv, open, err := config.App.DatabaseConfig()

	if err != nil {
		log.Fatalf("Could not find database config. %s", err)
	}

	db, err := sqlx.Open(drv, open)

	return db, err
}

func startServer(db *sqlx.DB) {
	http.Handle("/auth/", http.StripPrefix("/auth", api.NewAuthApi(db)))

	// ----------------------------------------------------------------

	apiRouter := mux.NewRouter()

	documentApi := http.StripPrefix("/documents", api.NewDocumentApi(db))

	apiRouter.Handle("/documents", documentApi)
	apiRouter.Handle("/documents/{id:[0-9]+}", documentApi)

	userApi := http.StripPrefix("/users", api.NewUserApi(db))

	apiRouter.Handle("/users", userApi)
	apiRouter.Handle("/users/{id:[0-9]+}", userApi)

	// GENERATOR INJECT

	http.Handle("/api/", http.StripPrefix("/api", handlers.CheckUser(apiRouter, db, false)))

	// ----------------------------------------------------------------

	// Configure handlers
	dynamicHandler := mux.NewRouter()

	appHandlers := handlers.NewAppHandlers(db)

	dynamicHandler.Handle("/", appHandlers.HomeHandler())
	dynamicHandler.Handle("/test", appHandlers.TestHandler())
	dynamicHandler.Handle("/upload", appHandlers.UploadHandler())

	http.Handle("/", dynamicHandler)

	// ----------------------------------------------------------------

	// Assets
	assetHandler := http.FileServer(http.Dir(config.App.AssetRoot()))
	http.Handle("/assets/", http.StripPrefix("/assets/", assetHandler))

	// Admin
	adminHandler := http.FileServer(http.Dir(config.App.AdminRoot()))
	http.Handle("/admin/", http.StripPrefix("/admin/", adminHandler))

	// Mobile
	mobileHandler := http.FileServer(http.Dir("ionic/www"))
	http.Handle("/mobile/", http.StripPrefix("/mobile/", mobileHandler))

	// ----------------------------------------------------------------

	fmt.Printf("Starting server on port %s using Env: %s\n", config.App.ListenAddress(), config.App.Env())

	err := http.ListenAndServe(config.App.ListenAddress(), nil)

	if err != nil {
		log.Fatalf("Could not start HTTP server. %s", err)
	}
}
