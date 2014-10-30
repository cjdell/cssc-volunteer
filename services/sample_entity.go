package services

import (
  "cssc/model/entity"
  "cssc/model/persister"
)

type SampleEntityService struct {
  persister *persister.SampleEntityPersister
  user      *entity.User
}

// A struct composed of the record coupled with additional computed information
type SampleEntityInfo struct {
  *entity.SampleEntity
}

// A struct to hold additional modifications that don't fit into the record data structure
type SampleEntityChanges struct {
  *entity.SampleEntity

  Changes struct {
    Fields []string
  }
}

func NewSampleEntityService(db persister.DB, user *entity.User) *SampleEntityService {
  return &SampleEntityService{persister.NewSampleEntityPersister(db), user}
}

func (self *SampleEntityService) GetAll(limit *persister.Limit) ([]*SampleEntityInfo, error) {
  var err error
  var sampleEntities []*entity.SampleEntity

  if sampleEntities, err = self.persister.GetAll(limit); err != nil {
    return nil, err
  }

  sampleEntityInfos := make([]*SampleEntityInfo, len(sampleEntities), len(sampleEntities))

  for i, sampleEntity := range sampleEntities {
    sampleEntityInfos[i], _ = self.sampleEntityInfo(sampleEntity)
  }

  return sampleEntityInfos, nil
}

func (self *SampleEntityService) GetOne(id int64) (*SampleEntityInfo, error) {
  var err error
  var sampleEntity *entity.SampleEntity

  if sampleEntity, err = self.persister.GetById(id); err != nil {
    return nil, err
  }

  return self.sampleEntityInfo(sampleEntity)
}

func (self *SampleEntityService) Insert(sampleEntityChanges *SampleEntityChanges) (*SampleEntityInfo, error) {
  var err error
  var id int64

  if id, err = self.persister.Insert(sampleEntityChanges.SampleEntity); err != nil {
    return nil, err
  }

  if err = self.processChanges(sampleEntityChanges); err != nil {
    return nil, err
  }

  return self.GetOne(id)
}

func (self *SampleEntityService) Update(sampleEntityChanges *SampleEntityChanges) (*SampleEntityInfo, error) {
  var err error
  var sampleEntity *entity.SampleEntity

  if sampleEntity, err = self.persister.GetById(sampleEntityChanges.Id); err != nil {
    return nil, err
  }

  if err = sampleEntity.Merge(sampleEntityChanges.SampleEntity, sampleEntityChanges.Changes.Fields); err != nil {
    return nil, err
  }

  if err = self.persister.Update(sampleEntity); err != nil {
    return nil, err
  }

  if err = self.processChanges(sampleEntityChanges); err != nil {
    return nil, err
  }

  return self.GetOne(sampleEntity.Id)
}

func (self *SampleEntityService) Delete(id int64) error {
  return self.persister.Delete(id)
}

// Wrap SampleEntity into SampleEntityInfo - Add computed properties here
func (self *SampleEntityService) sampleEntityInfo(sampleEntity *entity.SampleEntity) (*SampleEntityInfo, error) {
  return &SampleEntityInfo{sampleEntity}, nil
}

// Process additional mutations that might exist i.e. an uploaded file
func (self *SampleEntityService) processChanges(sampleEntityChanges *SampleEntityChanges) error {
  return nil
}
