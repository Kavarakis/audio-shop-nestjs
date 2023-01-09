#!/bin/bash -e
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

if [ -f $ROOT_DIR/.env ]; then
    export $(cat $ROOT_DIR/.env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

echo "Starting seeding the database"

pg_restore -h localhost -p 5432 -U $POSTGRES_USER -d $POSTGRES_DB -x $ROOT_DIR/scripts/db.dump

echo "Database seeded"
