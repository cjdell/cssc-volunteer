package handlers

import (
	"cssc/api"
	"cssc/model/persister"
	"fmt"
	"github.com/jmoiron/sqlx"
	"net/http"
)

func CheckUser(h http.Handler, db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("API-Key")

		persister := persister.NewUserPersister(db)
		user, err := persister.GetByApiKey(apiKey)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, err.Error())
			return
		}

		if user == nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprintf(w, "Valid API key is required for this service")
			return
		}

		api.SetUser(r, user)

		h.ServeHTTP(w, r)
	})
}
