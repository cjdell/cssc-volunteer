package handlers

import (
	"cssc/config"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	//"time"
)

func (self AppHandlers) UploadHandler() AppHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		body, err := ioutil.ReadAll(r.Body)

		var (
			fileId   = r.Header.Get("X-Upload-File-ID")
			fileName = r.Header.Get("X-Upload-File-Name")
		)

		var (
			saveFileName = fileId + "_" + fileName
			savePath     = path.Join(config.App.AssetRoot(), "uploads", "temp")
			saveFilePath = path.Join(savePath, saveFileName)
		)

		err = os.MkdirAll(savePath, 0775)

		fo, err := os.Create(saveFilePath)

		if err != nil {
			return err
		}

		//time.Sleep(5000 * time.Millisecond)

		_, err = fo.Write(body)

		if err != nil {
			return err
		}

		fmt.Fprint(w, saveFileName)

		return nil
	}
}
