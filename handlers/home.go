package handlers

import (
	"github.com/gorilla/mux"
	"net/http"
)

type homeContent struct {
	title string
}

func (self homeContent) Title() string {
	return self.title
}

func (self homeContent) ContentBody() interface{} {
	return nil
}

func (self AppHandlers) HomeHandler() AppHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		handle := vars["handle"]

		var (
			title = ""
		)

		err := error(nil)

		if handle == "" {
			title = "Home"
		}

		if err != nil {
			return err
		}

		return self.Render(&homeContent{title}, []string{"pages/home.html"}, w)
	}
}
