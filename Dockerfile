FROM golang:1.8.0
MAINTAINER mlabouardy

COPY . /app

RUN go get -v github.com/gorilla/mux

WORKDIR /app

CMD go run main.go
