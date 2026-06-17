# syntax=docker/dockerfile:1
#
# Multi-stage build for the FinPlan GraphQL API.
# The build stage runs on the *build* platform and produces framework-dependent (portable IL)
# output, so a single build serves every target arch — the runtime stage is then pulled per
# target platform. This gives multi-arch images without emulating the SDK.

ARG DOTNET_VERSION=10.0

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
WORKDIR /src

# Restore layer: copy only project metadata first so `dotnet restore` is cached until a
# dependency actually changes.
COPY Directory.Build.props FinPlan.slnx ./
COPY src/FinPlan.Api/FinPlan.Api.csproj src/FinPlan.Api/
COPY src/FinPlan.Application/FinPlan.Application.csproj src/FinPlan.Application/
COPY src/FinPlan.Domain/FinPlan.Domain.csproj src/FinPlan.Domain/
COPY src/FinPlan.Infrastructure/FinPlan.Infrastructure.csproj src/FinPlan.Infrastructure/
RUN dotnet restore src/FinPlan.Api/FinPlan.Api.csproj

# Build + publish.
COPY . .
RUN dotnet publish src/FinPlan.Api/FinPlan.Api.csproj \
    -c Release \
    --no-restore \
    -o /app

# Chiseled runtime: no shell/package manager, minimal CVE surface, non-root by default.
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}-noble-chiseled AS final
WORKDIR /app
COPY --from=build /app .

# Kestrel binds 8080 (the chiseled images' convention) on all interfaces.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# APP_UID (1654) is defined by the chiseled base image; run as that non-root user.
USER $APP_UID

# Default entrypoint serves the API. The Helm migration Job overrides the args with ["migrate"]
# to apply EF Core migrations and exit (see src/Program.cs).
ENTRYPOINT ["dotnet", "FinPlan.Api.dll"]
