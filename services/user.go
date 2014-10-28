package services

import (
	"cssc/model/entity"
	"cssc/model/persister"
	"github.com/jmoiron/sqlx"
)

type UserService struct {
	persister *persister.UserPersister
	user      *entity.User
}

func NewUserService(db *sqlx.DB, user *entity.User) *UserService {
	return &UserService{persister.NewUserPersister(db), user}
}

func (self *UserService) GetUsers(limit *persister.Limit) ([]*entity.User, error) {
	return self.persister.GetAll(limit)
}

func (self *UserService) GetUserById(id int64) (*entity.User, error) {
	return self.persister.GetById(id)
}

func (self *UserService) Insert(userChanges *entity.User) (*entity.User, error) {
	var err error
	var id int64

	if id, err = self.persister.Insert(userChanges); err != nil {
		return nil, err
	}

	return self.GetUserById(id)
}

func (self *UserService) Update(userChanges *entity.User) (*entity.User, error) {
	var err error
	var user *entity.User

	if user, err = self.persister.GetById(userChanges.Id); err != nil {
		return nil, err
	}

	user.Update(userChanges)

	if err = self.persister.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (self *UserService) Delete(id int64) error {
	return self.persister.Delete(id)
}
