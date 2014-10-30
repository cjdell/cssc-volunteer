package api

import (
	"cssc/model/entity"
	"cssc/model/persister"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/gorilla/context"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
)

type ContextKey int

const (
	UserKey ContextKey = 1
)

func GetUser(r *http.Request) *entity.User {
	user, exists := context.GetOk(r, UserKey)

	if !exists {
		return nil
	}

	return user.(*entity.User)
}

func SetUser(r *http.Request, user *entity.User) {
	context.Set(r, UserKey, user)
}

type AuthError struct {
}

func (AuthError) Error() string { return "Authentication required" }

type HandlerFuncWithError func(w rest.ResponseWriter, r *rest.Request, db persister.DB) error

// Wraps a handler func that returns an error into a new handler that runs inside a transaction
func transactionWrap(db *sqlx.DB, f HandlerFuncWithError) rest.HandlerFunc {
	return func(w rest.ResponseWriter, r *rest.Request) {
		var err error

		tx, err := db.Beginx()

		defer func() {
			if err != nil && tx != nil {
				tx.Rollback()
				log.Println("Transaction rolled back")
				return
			}

			err = tx.Commit()

			if err != nil {
				panic(err)
			} else {
				log.Println("Transaction commited")
			}
		}()

		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = f(w, r, tx)

		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
