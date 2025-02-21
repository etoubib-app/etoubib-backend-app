migration-backoffice-generate:
	SCHEMA_NAME='backoffice' pnpm run migration:generate
migration-backoffice-run:
	CONFIG_FILE='backoffice' pnpm run migration:run



migration-core-generate:
	SCHEMA_NAME='core' pnpm run migration:generate
migration-core-run:
	CONFIG_FILE='core' TYPEORM_CORE_SCHEMA='core' pnpm run migration:run


migration-run-all:
	pnpm run migration:runs
