#!/bin/bash
docker run -v $PWD:/pt -it --rm --link postgres:postgres postgres psql -h postgres -U postgres -d jz_word -f /pt/j_words.sql