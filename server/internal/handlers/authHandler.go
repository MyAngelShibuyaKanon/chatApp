package handlers

import (
	"log"
	"net/http"
	"time"

	mockdata "github.com/MyAngelShibuyaKanon/chatApp/server/internal/mockData"
	"github.com/MyAngelShibuyaKanon/chatApp/server/internal/models"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func ListUsers(c echo.Context) error {
	return c.JSON(200, mockdata.Users)
}

func GetUser(c echo.Context) error {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		log.Fatal("Invalid UUID format: ", err)
	}

	for _, user := range mockdata.Users {
		if user.ID == id {
			return c.JSON(http.StatusOK, user)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"error": "user not found"})
}

func CreateUser(c echo.Context) error {
	var user models.User
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(400, echo.Map{"error": "invalid body", "details": err})
	}
	user.ID = uuid.New()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	mockdata.Users = append(mockdata.Users, user)
	return c.JSON(http.StatusCreated, user)
}
