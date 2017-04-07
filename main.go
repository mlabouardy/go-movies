package main

import (
	"net/http"

	"github.com/gorilla/mux"

	. "./controller"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/movies", GetMoviesEndPoint).Methods("GET")
	router.HandleFunc("/movies", CreateMovieEndPoint).Methods("POST")
	router.HandleFunc("/movies/{id}", DeleteMovieEndPoint).Methods("DELETE")
	router.HandleFunc("/movies/{id}", GetMovieEndPoint).Methods("GET")
	router.Handle("/", http.FileServer(http.Dir("./public/")))
	http.ListenAndServe("localhost:5000", router)
}
