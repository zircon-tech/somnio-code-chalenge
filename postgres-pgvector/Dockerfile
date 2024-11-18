FROM postgres:16.0-bullseye

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-16 \
    clang \
    python-clang \
    clang-11 \
    llvm-11 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN git clone https://github.com/pgvector/pgvector.git

WORKDIR /tmp/pgvector
RUN PG_CONFIG=/usr/lib/postgresql/16/bin/pg_config make
RUN PG_CONFIG=/usr/lib/postgresql/16/bin/pg_config make install
