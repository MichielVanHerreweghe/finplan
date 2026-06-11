IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

// Pinned superuser password (read from the "postgres-password" parameter in user secrets).
// Keeping it stable prevents the persistent data volume — which bakes in the password on first
// init — from drifting out of sync with the value Aspire injects into the API.
IResourceBuilder<ParameterResource> postgresPassword =
    builder.AddParameter("postgres-password", secret: true);

// PostgreSQL server with a persistent data volume and the pgAdmin management UI.
IResourceBuilder<PostgresServerResource> postgres = builder
    .AddPostgres("postgres", password: postgresPassword)
    .WithDataVolume()
    .WithPgAdmin();

// Connection-string resource named "Database" (matching the app's ConnectionStrings:Database
// contract); the physical database is "finplan", inside which the app uses the finplan schema.
IResourceBuilder<PostgresDatabaseResource> database = postgres.AddDatabase("Database", "finplan");

builder.AddProject<Projects.FinPlan_Api>("api")
    .WithReference(database)
    .WaitFor(database);

builder.Build()
    .Run();
