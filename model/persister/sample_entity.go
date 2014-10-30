package persister

import (
	"cssc/model/entity"
	"reflect"
)

type SampleEntityPersister struct {
	db     DB
	common *commonPersister
}

func NewSampleEntityPersister(db DB) *SampleEntityPersister {
	entityType := reflect.TypeOf(&entity.SampleEntity{}).Elem()
	return &SampleEntityPersister{db, &commonPersister{db, entityType}}
}

func (self SampleEntityPersister) GetAll(limit *Limit) ([]*entity.SampleEntity, error) {
	sampleEntities := []*entity.SampleEntity{}
	return sampleEntities, self.common.getAll(&sampleEntities, limit, "", nil)
}

func (self SampleEntityPersister) GetById(id int64) (*entity.SampleEntity, error) {
	sampleEntity := &entity.SampleEntity{}
	return sampleEntity, self.common.getOne(sampleEntity, "WHERE id = :id", NewQueryParametersWithId(id))
}

func (self SampleEntityPersister) Insert(sampleEntity *entity.SampleEntity) (int64, error) {
	return self.common.insert(sampleEntity)
}

func (self SampleEntityPersister) Update(sampleEntity *entity.SampleEntity) error {
	return self.common.update(sampleEntity)
}

func (self SampleEntityPersister) Delete(id int64) error {
	return self.common.delete(id)
}
