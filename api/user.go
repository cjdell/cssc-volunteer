package api

import (
	"cssc/model/entity"
	"cssc/services"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
	"strconv"
)

type (
	userApi struct{}

	userRequest  struct{ *rest.Request }
	userResponse struct{ rest.ResponseWriter }

	userHandler func(*services.UserService, userResponse, userRequest) error
)

func NewUserApi(db *sqlx.DB) http.Handler {
	api := userApi{}

	handler := &rest.ResourceHandler{}

	wrap := func(handler userHandler, db *sqlx.DB) rest.HandlerFunc {
		return rest.HandlerFunc(func(w rest.ResponseWriter, r *rest.Request) {
			service := services.NewUserService(db, GetUser(r.Request))

			if err := handler(service, userResponse{w}, userRequest{r}); err != nil {
				rest.Error(w, err.Error(), http.StatusInternalServerError)
			}
		})
	}

	err := handler.SetRoutes(
		&rest.Route{"GET", "/", wrap(userHandler(api.getAll), db)},
		&rest.Route{"GET", "/:id", wrap(userHandler(api.getOne), db)},
		&rest.Route{"POST", "/", wrap(userHandler(api.post), db)},
		&rest.Route{"PUT", "/:id", wrap(userHandler(api.put), db)},
		&rest.Route{"DELETE", "/:id", wrap(userHandler(api.delete), db)},
	)

	if err != nil {
		log.Fatal(err)
	}

	return handler
}

func (userApi) getAll(service *services.UserService, res userResponse, req userRequest) error {
	users, err := service.GetUsers(nil)

	if err != nil {
		return err
	}

	return res.WriteUsers(users)
}

func (userApi) getOne(service *services.UserService, res userResponse, req userRequest) error {
	user, err := service.GetUserById(req.Id())

	if err != nil {
		return err
	}

	return res.WriteUser(user)
}

func (userApi) post(service *services.UserService, res userResponse, req userRequest) error {
	var err error

	user := req.User()

	if user, err = service.Insert(user); err != nil {
		return err
	}

	return res.WriteUser(user)
}

func (userApi) put(service *services.UserService, res userResponse, req userRequest) error {
	var err error

	user := req.User()
	user.Id = req.Id()

	if user, err = service.Update(user); err != nil {
		return err
	}

	return res.WriteUser(user)
}

func (userApi) delete(service *services.UserService, res userResponse, req userRequest) error {
	if err := service.Delete(req.Id()); err != nil {
		return err
	}

	res.WriteHeader(http.StatusOK)

	return nil
}

func (req userRequest) Id() int64 {
	id := int64(-1)

	if idStr := req.PathParam("id"); idStr != "" {
		id, _ = strconv.ParseInt(idStr, 10, 64)
	}

	return id
}

func (req userRequest) User() *entity.User {
	user := &entity.User{}

	if err := req.DecodeJsonPayload(&user); err != nil {
		panic(err)
	}

	return user
}

func (res userResponse) WriteUsers(users []*entity.User) error {
	return res.WriteJson(users)
}

func (res userResponse) WriteUser(user *entity.User) error {
	return res.WriteJson(user)
}
