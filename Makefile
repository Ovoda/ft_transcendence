all:		${NAME}

${NAME}:	build up

up: build
		docker-compose -f srcs/docker-compose.yml up

build:
		docker-compose -f srcs/docker-compose.yml build
connect:
		psql -h localhost -U wolfpack -d pong -p 5432