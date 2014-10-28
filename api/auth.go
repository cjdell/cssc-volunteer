package api

import (
	"cssc/services"
	"github.com/jmoiron/sqlx"
	"net/http"
)

type AuthApi struct {
	authService *services.AuthService
}

func NewAuthApi(db *sqlx.DB) *AuthApi {
	return &AuthApi{services.NewAuthService(db)}
}

type AuthSignInArgs struct {
	Email    string
	Password string
}

type AuthSignInReply struct {
	*services.SignInResponse
}

func (self *AuthApi) SignIn(r *http.Request, args *AuthSignInArgs, reply *AuthSignInReply) error {
	res, err := self.authService.SignIn(args.Email, args.Password)

	reply.SignInResponse = res

	return err
}

type AuthRegisterArgs struct {
	Email    string
	Password string
}

type AuthRegisterReply struct {
}

func (self *AuthApi) Register(r *http.Request, args *AuthRegisterArgs, reply *AuthRegisterReply) error {
	_, err := self.authService.RegisterUser(args.Email, args.Password)
	return err
}
