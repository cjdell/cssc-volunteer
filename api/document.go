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
	documentApi struct{}

	documentRequest  struct{ *rest.Request }
	documentResponse struct{ rest.ResponseWriter }

	documentAction func(*services.DocumentService, documentResponse, documentRequest) error
)

func NewDocumentApi(db *sqlx.DB) http.Handler {
	api := documentApi{}

	handler := &rest.ResourceHandler{}

	wrap := func(action documentAction, db *sqlx.DB, requireUser bool) rest.HandlerFunc {
		return transactionWrap(db, func(w rest.ResponseWriter, r *rest.Request, db persister.DB) error {
			user := GetUser(r.Request)

			if requireUser && user == nil {
				return AuthError{}
			}

			service := services.NewDocumentService(db, user)

			return action(service, documentResponse{w}, documentRequest{r})
		})
	}

	err := handler.SetRoutes(
		&rest.Route{"GET", "/", wrap(documentAction(api.getAll), db, false)},
		&rest.Route{"GET", "/:id", wrap(documentAction(api.getOne), db, false)},
		&rest.Route{"POST", "/", wrap(documentAction(api.post), db, true)},
		&rest.Route{"PUT", "/:id", wrap(documentAction(api.put), db, true)},
		&rest.Route{"DELETE", "/:id", wrap(documentAction(api.delete), db, true)},
	)

	if err != nil {
		log.Fatal(err)
	}

	return handler
}

func (documentApi) getAll(service *services.DocumentService, res documentResponse, req documentRequest) error {
	documents, err := service.GetAll(nil)

	if err != nil {
		return err
	}

	return res.WriteDocuments(documents)
}

func (documentApi) getOne(service *services.DocumentService, res documentResponse, req documentRequest) error {
	document, err := service.GetOne(req.Id())

	if err != nil {
		return err
	}

	return res.WriteDocument(document)
}

func (documentApi) post(service *services.DocumentService, res documentResponse, req documentRequest) error {
	var err error
	var document *services.DocumentInfo

	if document, err = service.Insert(req.Document()); err != nil {
		return err
	}

	return res.WriteDocument(document)
}

func (documentApi) put(service *services.DocumentService, res documentResponse, req documentRequest) error {
	var err error
	var document *services.DocumentInfo

	if document, err = service.Update(req.Document()); err != nil {
		return err
	}

	return res.WriteDocument(document)
}

func (documentApi) delete(service *services.DocumentService, res documentResponse, req documentRequest) error {
	if err := service.Delete(req.Id()); err != nil {
		return err
	}

	res.WriteHeader(http.StatusOK)

	return nil
}

func (req documentRequest) Id() int64 {
	id := int64(-1)

	if idStr := req.PathParam("id"); idStr != "" {
		id, _ = strconv.ParseInt(idStr, 10, 64)
	}

	return id
}

func (req documentRequest) Document() *services.DocumentChanges {
	document := &services.DocumentChanges{}

	if err := req.DecodeJsonPayload(&document); err != nil {
		panic(err)
	}

	if req.Id() != -1 {
		document.Id = req.Id()
	}

	return document
}

func (res documentResponse) WriteDocuments(documents []*services.DocumentInfo) error {
	return res.WriteJson(documents)
}

func (res documentResponse) WriteDocument(document *services.DocumentInfo) error {
	return res.WriteJson(document)
}
