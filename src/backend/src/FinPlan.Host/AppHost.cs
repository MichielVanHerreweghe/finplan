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

// Pin the API to a fixed port. Without this, Aspire runs Kestrel on a random port behind a
// proxy, so the console "Now listening on ..." line drifts every run. isProxied: false makes
// the API bind 5080 directly — the stable port the frontend Vite proxy and codegen expect.
builder.AddProject<Projects.FinPlan_Api>("api")
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5080;
        endpoint.IsProxied = false;
    })
    .WithReference(database)
    .WaitFor(database);

builder.Build()
    .Run();
