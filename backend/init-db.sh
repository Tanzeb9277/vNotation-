#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
until PGPASSWORD=postgres psql -h "db" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - creating database if not exists"

# Create database if it doesn't exist
PGPASSWORD=postgres psql -h "db" -U "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = 'notesdb'" | grep -q 1 || \
PGPASSWORD=postgres psql -h "db" -U "postgres" -c "CREATE DATABASE notesdb"

>&2 echo "Database exists - executing migrations"

# Run migrations
PGPASSWORD=postgres psql -h "db" -U "postgres" -d "notesdb" -f /app/db/migrations/init.sql

>&2 echo "Migrations completed"

# Verify tables exist
PGPASSWORD=postgres psql -h "db" -U "postgres" -d "notesdb" -c "\dt" 