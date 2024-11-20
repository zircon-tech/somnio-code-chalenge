#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DB_HOST="127.0.0.1"
DB_OPTIONS="connection_limit=2&pool_timeout=10"
DB_PORT="5432"
DB_NAME="test-pgdb"
DB_SCHEMA="public"
DB_USER="test-pguser"
DB_PASS="test-pgpass"

echo "Current directory: $(pwd)"
echo "DIR is: \"$DIR\""
ls -l "$DIR"

docker-compose --file docker-compose.test.yml up --detach || { echo "cant start database" ; exit 1 ; }
echo 'Waiting for database to be ready...'
"$DIR/wait-for-it.sh" -s "127.0.0.1:5432" --timeout=20 -- echo 'database is ready!' || { echo "cant connect with database" ; exit 1 ; }
sleep 10

DB_HOST=$DB_HOST \
DB_OPTIONS=$DB_OPTIONS \
DB_PORT=$DB_PORT \
DB_NAME=$DB_NAME \
DB_SCHEMA=$DB_SCHEMA \
DB_USER=$DB_USER \
DB_PASS=$DB_PASS \
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=2&pool_timeout=10" \
  npx prisma migrate deploy || { echo "cant run migrations" ; exit 1 ; }

# Check if a specific filename test pattern is provided to match with
if [ -n "$2" ]; then
    TEST_PATTERN=".*$2.*\.e2e-spec\.ts$"
else
    TEST_PATTERN="\.e2e-spec\.ts$"
fi

DB_HOST=$DB_HOST \
DB_OPTIONS=$DB_OPTIONS \
DB_PORT=$DB_PORT \
DB_NAME=$DB_NAME \
DB_SCHEMA=$DB_SCHEMA \
DB_USER=$DB_USER \
DB_PASS=$DB_PASS \
  node --max-old-space-size=3072 \
  ./node_modules/.bin/jest . --config ./jest.config.json --forceExit --testTimeout 50000 --runInBand \
  --testRegex "$TEST_PATTERN" \
  --setupFilesAfterEnv ./test/jest/setup/global-setup-after-env-e2e.ts
