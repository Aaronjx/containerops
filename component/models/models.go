/*
Copyright 2014 Huawei Technologies Co., Ltd. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package models

import (
	"os"

	logs "github.com/Huawei/containerops/component/log"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/containerops/configure"
)

var (
	db  *gorm.DB
	log *logs.Logger
)

func init() {
	log = logs.New()
}

// OpenDatabase is
func OpenDatabase() {
	var err error

	if db, err = gorm.Open(configure.GetString("database.driver"), configure.GetString("database.uri")); err != nil {
		log.Fatal("Initlization database connection error.")
		os.Exit(1)
	} else {
		db.DB()
		db.DB().Ping()
		db.SingularTable(true)
		db.DB().SetMaxIdleConns(10)
		db.DB().SetMaxOpenConns(100)
	}
}

//Migrate is
func Migrate() {
	OpenDatabase()

	db.AutoMigrate(&Component{})

	log.Info("AutMigrate database structs.")
}

// GetDB is
func GetDB() *gorm.DB {
	if db != nil {
		return db
	}

	OpenDatabase()
	return db
}
