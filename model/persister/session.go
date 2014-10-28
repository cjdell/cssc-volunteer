package persister

import (
	"cssc/model/entity"
	"reflect"
)

type SessionPersister struct {
	db     DB
	common *commonPersister
}

func NewSessionPersister(db DB) *SessionPersister {
	entityType := reflect.TypeOf(&entity.Session{}).Elem()
	return &SessionPersister{db, &commonPersister{db, entityType}}
}

func (self SessionPersister) GetByKey(key string) (*entity.Session, error) {
	session := &entity.Session{}

	params := QueryParameters{}
	params["key"] = key

	return session, self.common.getOne(session, "WHERE key = :key", params)
}

func (self SessionPersister) Insert(session *entity.Session) (int64, error) {
	return self.common.insert(session)
}

func (self SessionPersister) Delete(id int64) error {
	return self.common.delete(id)
}
