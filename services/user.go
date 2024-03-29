package services

import (
	"cssc/model/entity"
	"cssc/model/persister"
)

type UserService struct {
	persister *persister.UserPersister
	user      *entity.User
}

// A struct composed of the record coupled with additional computed information
type UserInfo struct {
	*entity.User
}

// A struct to hold additional modifications that don't fit into the record data structure
type UserChanges struct {
	*entity.User

	Changes struct {
		Fields      []string
		NewPassword string
	}
}

func NewUserService(db persister.DB, user *entity.User) *UserService {
	return &UserService{persister.NewUserPersister(db), user}
}

func (self *UserService) GetAll(limit *persister.Limit) ([]*UserInfo, error) {
	var err error
	var users []*entity.User

	if users, err = self.persister.GetAll(limit); err != nil {
		return nil, err
	}

	userInfos := make([]*UserInfo, len(users), len(users))

	for i, user := range users {
		userInfos[i], _ = self.userInfo(user)
	}

	return userInfos, nil
}

func (self *UserService) GetOne(id int64) (*UserInfo, error) {
	var err error
	var user *entity.User

	if user, err = self.persister.GetById(id); err != nil {
		return nil, err
	}

	return self.userInfo(user)
}

func (self *UserService) Insert(userSave *UserChanges) (*UserInfo, error) {
	var err error

	user := userSave.User

	if err = self.beforeSave(user, userSave); err != nil {
		return nil, err
	}

	if user.Id, err = self.persister.Insert(user); err != nil {
		return nil, err
	}

	if err = self.afterSave(user, userSave); err != nil {
		return nil, err
	}

	return self.GetOne(user.Id)
}

func (self *UserService) Update(userSave *UserChanges) (*UserInfo, error) {
	var err error
	var user *entity.User

	if user, err = self.persister.GetById(userSave.Id); err != nil {
		return nil, err
	}

	if err = self.beforeSave(user, userSave); err != nil {
		return nil, err
	}

	if err = self.persister.Update(user); err != nil {
		return nil, err
	}

	if err = self.afterSave(user, userSave); err != nil {
		return nil, err
	}

	return self.GetOne(user.Id)
}

func (self *UserService) Delete(id int64) error {
	return self.persister.Delete(id)
}

// Wrap User into UserInfo - Add computed properties here
func (self *UserService) userInfo(user *entity.User) (*UserInfo, error) {
	return &UserInfo{user}, nil
}

// Handle UserSave - before saving to the database
func (self *UserService) beforeSave(user *entity.User, userSave *UserChanges) error {
	if userSave.Changes.NewPassword != "" {
		user.SetPassword(userSave.Changes.NewPassword)
	}

	return user.Merge(userSave.User, userSave.Changes.Fields)
}

// Handle UserSave - after saving to the database
func (self *UserService) afterSave(user *entity.User, userSave *UserChanges) error {
	return nil
}
