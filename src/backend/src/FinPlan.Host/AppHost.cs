IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL server with a persistent data volume and the pgAdmin management UI.
IResourceBuilder<PostgresServerResource> postgres = builder
    .AddPostgres("postgres")
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
