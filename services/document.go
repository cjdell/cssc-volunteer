package services

import (
	"cssc/model/entity"
	"cssc/model/persister"
)

type DocumentService struct {
	persister *persister.DocumentPersister
	user      *entity.User
}

// A struct composed of the record coupled with additional computed information
type DocumentInfo struct {
	*entity.Document

	Images      []*Image
	Attachments []*Attachment
}

// A struct to hold additional modifications that don't fit into the record data structure
type DocumentChanges struct {
	*entity.Document

	Changes struct {
		Fields                []string
		NewImageFileName      string
		NewAttachmentFileName string
	}
}

func NewDocumentService(db persister.DB, user *entity.User) *DocumentService {
	return &DocumentService{persister.NewDocumentPersister(db), user}
}

func (self *DocumentService) GetAll(limit *persister.Limit) ([]*DocumentInfo, error) {
	var err error
	var documents []*entity.Document

	if documents, err = self.persister.GetAll(limit); err != nil {
		return nil, err
	}

	documentInfos := make([]*DocumentInfo, len(documents), len(documents))

	for i, document := range documents {
		documentInfos[i], _ = self.documentInfo(document)
	}

	return documentInfos, nil
}

func (self *DocumentService) GetOne(id int64) (*DocumentInfo, error) {
	var err error
	var document *entity.Document

	if document, err = self.persister.GetById(id); err != nil {
		return nil, err
	}

	return self.documentInfo(document)
}

func (self *DocumentService) Insert(documentChanges *DocumentChanges) (*DocumentInfo, error) {
	var err error
	var id int64

	documentChanges.Version = 1

	if id, err = self.persister.Insert(documentChanges.Document); err != nil {
		return nil, err
	}

	documentChanges.Id = id

	// Need ID before this can work
	if err = self.processChanges(documentChanges); err != nil {
		return nil, err
	}

	return self.GetOne(id)
}

func (self *DocumentService) Update(documentChanges *DocumentChanges) (*DocumentInfo, error) {
	var err error
	var document *entity.Document

	if document, err = self.persister.GetById(documentChanges.Id); err != nil {
		return nil, err
	}

	if err = document.Merge(documentChanges.Document, documentChanges.Changes.Fields); err != nil {
		return nil, err
	}

	if documentChanges.Changes.NewAttachmentFileName != "" {
		document.Version++
	}

	if err = self.persister.Update(document); err != nil {
		return nil, err
	}

	if err = self.processChanges(documentChanges); err != nil {
		return nil, err
	}

	return self.GetOne(document.Id)
}

func (self *DocumentService) Delete(id int64) error {
	return self.persister.Delete(id)
}

func (self *DocumentService) documentInfo(document *entity.Document) (*DocumentInfo, error) {
	images, err := GetImages(document)

	if err != nil {
		return nil, err
	}

	attachments, err := GetAttachments(document)

	if err != nil {
		return nil, err
	}

	return &DocumentInfo{document, images, attachments}, nil
}

func (self *DocumentService) processChanges(documentChanges *DocumentChanges) error {
	if documentChanges.Changes.NewAttachmentFileName != "" {
		if err := AssignAttachment(documentChanges, documentChanges.Changes.NewAttachmentFileName, "document"); err != nil {
			return err
		}
	}

	if documentChanges.Changes.NewImageFileName != "" {
		if err := AssignImage(documentChanges, documentChanges.Changes.NewImageFileName, "preview", ""); err != nil {
			return err
		}
	}

	return nil
}
