package services

/*
	Attaching and retrieving files
*/

import (
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"strings"
)

type Attachable interface {
	GetTypeName() string
	GetId() int64
}

type Attachment struct {
	FileName string
	Src      string
	Handle   string
	Name     string
	Desc     string
}

func GetAttachableFolder(imageable Imageable) AssetFilePath {
	var (
		typeName         = strings.ToLower(imageable.GetTypeName())
		idStr            = strconv.FormatInt(imageable.GetId(), 10)
		attachableFolder = AssetFilePath(path.Join("uploads", "attachments", typeName, idStr))
	)

	return attachableFolder
}

func GetAttachments(attachable Attachable) ([]*Attachment, error) {
	attachableFolder := GetAttachableFolder(attachable)

	files, _ := ioutil.ReadDir(attachableFolder.Abs())

	var attachments []*Attachment

	for _, f := range files {
		if f.Name()[0] == '.' || f.IsDir() {
			continue
		}

		fileName := f.Name()
		fileNameNoExt := strings.Replace(fileName, path.Ext(fileName), "", 1)

		imageFilePathRel := attachableFolder.Append(fileName)

		attachment := &Attachment{
			FileName: fileName,
			Src:      imageFilePathRel.WebPath(),
			Handle:   fileNameNoExt,
			Name:     fileNameNoExt} // TODO: Humanise

		attachments = append(attachments, attachment)
	}

	return attachments, nil
}

func AssignAttachment(attachable Attachable, tempPath string, handle string) error {
	var (
		attachableFolder = GetAttachableFolder(attachable)
		tempFilePath     = AssetFilePath(path.Join("uploads", "temp", tempPath)) // Temporary file path
		fileNameNoExt    = handle
		destFilePath     = attachableFolder.Append(fileNameNoExt + path.Ext(tempPath))
	)

	if err := os.MkdirAll(attachableFolder.Abs(), 0775); err != nil {
		return err
	}

	clearCollisions(attachableFolder, fileNameNoExt)

	return os.Rename(tempFilePath.Abs(), destFilePath.Abs())
}

// Clear out files that might have the same handle but different extensions
func clearCollisions(attachableFolder AssetFilePath, fileNameNoExt string) {
	files, _ := ioutil.ReadDir(attachableFolder.Abs())

	for _, f := range files {
		if f.Name()[0] == '.' || f.IsDir() {
			continue
		}

		name := f.Name()
		nameNoExt := strings.Replace(name, path.Ext(name), "", 1)

		if nameNoExt == fileNameNoExt {
			os.Remove(attachableFolder.Append(name).Abs())
		}
	}
}
