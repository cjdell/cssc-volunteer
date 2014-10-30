package api

import (
	"cssc/model/persister"
	"cssc/services"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
	"strconv"
)

type (
	sampleEntityApi struct{}

	sampleEntityRequest  struct{ *rest.Request }
	sampleEntityResponse struct{ rest.ResponseWriter }

	sampleEntityAction func(*services.SampleEntityService, sampleEntityResponse, sampleEntityRequest) error
)

func NewSampleEntityApi(db *sqlx.DB) http.Handler {
	api := sampleEntityApi{}

	handler := &rest.ResourceHandler{}

	wrap := func(action sampleEntityAction, db *sqlx.DB, requireUser bool) rest.HandlerFunc {
		return transactionWrap(db, func(w rest.ResponseWriter, r *rest.Request, db persister.DB) error {
			user := GetUser(r.Request)

			if requireUser && user == nil {
				return AuthError{}
			}

			service := services.NewSampleEntityService(db, user)

			return action(service, sampleEntityResponse{w}, sampleEntityRequest{r})
		})
	}

	err := handler.SetRoutes(
		&rest.Route{"GET", "/", wrap(sampleEntityAction(api.getAll), db, false)},
		&rest.Route{"GET", "/:id", wrap(sampleEntityAction(api.getOne), db, false)},
		&rest.Route{"POST", "/", wrap(sampleEntityAction(api.post), db, true)},
		&rest.Route{"PUT", "/:id", wrap(sampleEntityAction(api.put), db, true)},
		&rest.Route{"DELETE", "/:id", wrap(sampleEntityAction(api.delete), db, true)},
	)

	if err != nil {
		log.Fatal(err)
	}

	return handler
}

func (sampleEntityApi) getAll(service *services.SampleEntityService, res sampleEntityResponse, req sampleEntityRequest) error {
	sampleEntities, err := service.GetAll(nil)

	if err != nil {
		return err
	}

	return res.WriteSampleEntities(sampleEntities)
}

func (sampleEntityApi) getOne(service *services.SampleEntityService, res sampleEntityResponse, req sampleEntityRequest) error {
	sampleEntity, err := service.GetOne(req.Id())

	if err != nil {
		return err
	}

	return res.WriteSampleEntity(sampleEntity)
}

func (sampleEntityApi) post(service *services.SampleEntityService, res sampleEntityResponse, req sampleEntityRequest) error {
	var err error
	var sampleEntity *services.SampleEntityInfo

	if sampleEntity, err = service.Insert(req.SampleEntity()); err != nil {
		return err
	}

	return res.WriteSampleEntity(sampleEntity)
}

func (sampleEntityApi) put(service *services.SampleEntityService, res sampleEntityResponse, req sampleEntityRequest) error {
	var err error
	var sampleEntity *services.SampleEntityInfo

	if sampleEntity, err = service.Update(req.SampleEntity()); err != nil {
		return err
	}

	return res.WriteSampleEntity(sampleEntity)
}

func (sampleEntityApi) delete(service *services.SampleEntityService, res sampleEntityResponse, req sampleEntityRequest) error {
	if err := service.Delete(req.Id()); err != nil {
		return err
	}

	res.WriteHeader(http.StatusOK)

	return nil
}

func (req sampleEntityRequest) Id() int64 {
	id := int64(-1)

	if idStr := req.PathParam("id"); idStr != "" {
		id, _ = strconv.ParseInt(idStr, 10, 64)
	}

	return id
}

func (req sampleEntityRequest) SampleEntity() *services.SampleEntityChanges {
	sampleEntity := &services.SampleEntityChanges{}

	if err := req.DecodeJsonPayload(&sampleEntity); err != nil {
		panic(err)
	}

	if req.Id() != -1 {
		sampleEntity.Id = req.Id()
	}

	return sampleEntity
}

func (res sampleEntityResponse) WriteSampleEntities(sampleEntities []*services.SampleEntityInfo) error {
	return res.WriteJson(sampleEntities)
}

func (res sampleEntityResponse) WriteSampleEntity(sampleEntity *services.SampleEntityInfo) error {
	return res.WriteJson(sampleEntity)
}
