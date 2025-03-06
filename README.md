# E-TOUBIB BACKEND
-----
## HOW TO SETUP PROJECT

#### Requirements
- docker
- docker-compose

#### SETUP & RUN PROJECT LOCALY
- RUN: docker-compose -f docker-compose.yml up --build
  - this will build your DB and then build your nestjs app and run it inside docker container in dev mode

-----
## MIGRATIONS

#### Requirements
- before running any migration CMD u will always put this CMD before
exemple: we want to run migration-run we will put
make run-in-docker COMMAND="migration-run"

#### create an empty migration
- migration-create

#### generate migration from entities changes
- migration-generate
  - this command will automatically check entities changes you made in you code and it will check the current migration status of your local DB, then generate just the missing changes
  - NOTE: you should always run migrations after pulling the last changes (in other words, your local DB should be always up-to-date before generating any  migration), so you don't generate double migrations

#### run all migration
- migration-run-all

#### run specefic migration
- migration-run
  - this command will ask you which schema name you want to run migration for, it can be backoffice or client, your default dev schema, it also can be new schema you created for a clinic, in your local DB
