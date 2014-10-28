package api

import (
	"cssc/model/entity"
	"github.com/gorilla/context"
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
