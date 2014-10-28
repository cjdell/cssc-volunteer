package persister

import (
	"cssc/model/entity"
	"reflect"
)

type DocumentPersister struct {
	db     DB
	common *commonPersister
}

func NewDocumentPersister(db DB) *DocumentPersister {
	entityType := reflect.TypeOf(&entity.Document{}).Elem()
	return &DocumentPersister{db, &commonPersister{db, entityType}}
}

func (self DocumentPersister) GetAll(limit *Limit) ([]*entity.Document, error) {
	documents := []*entity.Document{}
	return documents, self.common.getAll(&documents, limit, "", nil)
}

func (self DocumentPersister) GetById(id int64) (*entity.Document, error) {
	document := &entity.Document{}
	return document, self.common.getOne(document, "WHERE id = :id", NewQueryParametersWithId(id))
}

func (self DocumentPersister) Insert(document *entity.Document) (int64, error) {
	return self.common.insert(document)
}

func (self DocumentPersister) Update(document *entity.Document) error {
	return self.common.update(document)
}

func (self DocumentPersister) Delete(id int64) error {
	return self.common.delete(id)
}
