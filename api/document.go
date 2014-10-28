package api

import (
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

	documentHandler func(*services.DocumentService, documentResponse, documentRequest) error
)

func NewDocumentApi(db *sqlx.DB) http.Handler {
	api := documentApi{}

	handler := &rest.ResourceHandler{}

	wrap := func(handler documentHandler, db *sqlx.DB, requireUser bool) rest.HandlerFunc {
		return rest.HandlerFunc(func(w rest.ResponseWriter, r *rest.Request) {
			user := GetUser(r.Request)

			if requireUser && user == nil {
				rest.Error(w, "Authentication required", 401)
				return
			}

			service := services.NewDocumentService(db, user)

			if err := handler(service, documentResponse{w}, documentRequest{r}); err != nil {
				rest.Error(w, err.Error(), http.StatusInternalServerError)
			}
		})
	}

	err := handler.SetRoutes(
		&rest.Route{"GET", "/", wrap(documentHandler(api.getAll), db, false)},
		&rest.Route{"GET", "/:id", wrap(documentHandler(api.getOne), db, false)},
		&rest.Route{"POST", "/", wrap(documentHandler(api.post), db, true)},
		&rest.Route{"PUT", "/:id", wrap(documentHandler(api.put), db, true)},
		&rest.Route{"DELETE", "/:id", wrap(documentHandler(api.delete), db, true)},
	)

	if err != nil {
		log.Fatal(err)
	}

	return handler
}

func (documentApi) getAll(service *services.DocumentService, res documentResponse, req documentRequest) error {
	documents, err := service.GetDocuments(nil)

	if err != nil {
		return err
	}

	return res.WriteDocuments(documents)
}

func (documentApi) getOne(service *services.DocumentService, res documentResponse, req documentRequest) error {
	document, err := service.GetDocumentById(req.Id())

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

	documentChanges := req.Document()
	documentChanges.Id = req.Id()

	if document, err = service.Update(documentChanges); err != nil {
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

func (req documentRequest) Document() services.DocumentChanges {
	document := services.DocumentChanges{}

	if err := req.DecodeJsonPayload(&document); err != nil {
		panic(err)
	}

	return document
}

func (res documentResponse) WriteDocuments(documents []*services.DocumentInfo) error {
	return res.WriteJson(documents)
}

func (res documentResponse) WriteDocument(document *services.DocumentInfo) error {
	return res.WriteJson(document)
}
