#!/usr/bin/env bash
echo "You need docker container postgres && redis."
echo "If not, you may configure environment using commands below:"
echo "docker run --name postgres --restart=always -d postgres"
docker build . -t jz_word
docker run -it --rm --link postgres:postgres postgres psql -c "CREATE USER jz_word_user WITH PASSWORD '52%#fwe82'" -h postgres -U postgres
docker run -it --rm --link postgres:postgres postgres psql -c "CREATE DATABASE jz_word" -h postgres -U postgres
docker run -v $PWD:/var/www -w /var/www -t jz_word_tag yarn
docker run --name jz_word_instance --link postgres:postgres --restart=always -p 7998:7998 -v $PWD:/var/www -d -t jz_word_tag
