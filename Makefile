all:		${NAME}

${NAME}:	build up

up: build
		docker-compose -f ./docker-compose.yml up

install:
		npm install

build:
		docker-compose -f ./docker-compose.yml build
connect:
		psql -h localhost -U wolfpack -d pong -p 5432
