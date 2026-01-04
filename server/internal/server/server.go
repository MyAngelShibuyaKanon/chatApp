// Package server is the main server package
package server

import (
	"log"
	"net/http"

	"github.com/MyAngelShibuyaKanon/chatApp/server/internal/handlers"
	mockdata "github.com/MyAngelShibuyaKanon/chatApp/server/internal/mockData"
	"github.com/labstack/echo/v4"
)

func Run() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/users", handlers.ListUsers)
	e.GET("/users/:id", handlers.GetUser)
	e.POST("/users", handlers.CreateUser)
	e.PUT("/users/:id", handlers.UpdateUser)
	e.DELETE("/users/:id", handlers.DeleteUser)

	err := mockdata.LoadMockUsers("internal/mockData/mockUsers.json")
	if err != nil {
		log.Fatal(err)
	}
	e.Logger.Fatal(e.Start(":1323"))
}
