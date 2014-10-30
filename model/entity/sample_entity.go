package entity

type SampleEntity struct {
	__table struct{} `db:"sample_entities"`

	Id   int64  `db:"id"`
	Name string `db:"name"`
}

func (SampleEntity) GetTypeName() string {
	return "SampleEntity"
}

func (self *SampleEntity) GetId() int64 {
	return self.Id
}

func (self *SampleEntity) Merge(update *SampleEntity, fields []string) error {
  if contains(fields, "Name") {
    self.Name = update.Name
  }

  return nil
}
