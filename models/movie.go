package models

const (
	ACTION = iota
	COMEDY
	DRAMA
)

type Movie struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Director    Person   `json:"director"`
	Category    Category `json:"category"`
}

type Person struct {
	ID   int16  `json:"id"`
	Name string `json:"name"`
}

type Category uint8
