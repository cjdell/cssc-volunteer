package entity

type User struct {
	__table struct{} `db:"users"`

	Id    int64  `db:"id"`
	Type  string `db:"type"`
	Name  string `db:"name"`
	Email string `db:"email"`
	Hash  string `db:"hash"`
}

func (self User) GetId() int64 {
	return self.Id
}

func (self *User) Merge(update *User, fields []string) error {
	if contains(fields, "Type") {
		self.Type = update.Type
	}

	if contains(fields, "Name") {
		self.Name = update.Name
	}

	if contains(fields, "Email") {
		self.Email = update.Email
	}

	return nil
}
