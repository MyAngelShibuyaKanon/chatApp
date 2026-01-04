package mockdata

import (
	"encoding/json"
	"os"

	"github.com/MyAngelShibuyaKanon/chatApp/server/internal/models"
)

var Users []models.User

func LoadMockUsers(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &Users)
}
