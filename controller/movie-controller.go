package controller

import (
	"encoding/json"
	"net/http"

	. "../models"
	"github.com/gorilla/mux"
)

var movies []Movie

func init() {
	movies = append(movies, Movie{"1", "Avatar", "Science fiction movie so cool !", Person{1, "James Cameron"}, ACTION})
	movies = append(movies, Movie{"2", "Titanic", "Romantic movie staring Leonardo Dicaprio", Person{2, "Steven Spielberg"}, DRAMA})
}

func GetMoviesEndPoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type")
	json.NewEncoder(w).Encode(movies)
}

func CreateMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var movie Movie
	json.NewDecoder(r.Body).Decode(&movie)
	movies = append(movies, movie)
	json.NewEncoder(w).Encode(movies)
}

func GetMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var params = mux.Vars(r)
	var movieSelected Movie
	for _, movie := range movies {
		if movie.ID == params["id"] {
			movieSelected = movie
			break
		}
	}
	json.NewEncoder(w).Encode(movieSelected)
}

func DeleteMovieEndPoint(w http.ResponseWriter, r *http.Request) {
	var params = mux.Vars(r)
	for i, movie := range movies {
		if movie.ID == params["id"] {
			movies = append(movies[:i], movies[:i+1]...)
			break
		}
	}
	json.NewEncoder(w).Encode(movies)
}
