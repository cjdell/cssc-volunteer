package entity

type Document struct {
	__table struct{} `db:"documents"`

	Id          int64  `db:"id"`
	Name        string `db:"name"`
	Description string `db:"description"`
	Version     int32  `db:"version"`
}

func (Document) GetTypeName() string {
	return "Document"
}

func (self *Document) GetId() int64 {
	return self.Id
}

func (self *Document) Merge(update *Document, fields []string) error {
	if contains(fields, "Name") {
		self.Name = update.Name
	}

	if contains(fields, "Description") {
		self.Description = update.Description
	}

	return nil
}
