using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace FinPlan.Api.Security;

// Validates Auth0-issued OIDC ID tokens sent as Bearer tokens. The ID token is a JWT whose
// audience is the Auth0 application's client id and whose issuer is the Auth0 domain. Validating
// the ID token (rather than a separate API access token) keeps the email/name claims used for
// user provisioning and needs no Auth0 API/Action setup.
public static class AuthenticationExtensions
{
    public static IServiceCollection AddFinPlanAuthentication(
        this IServiceCollection services, IConfiguration configuration)
    {
        IConfigurationSection auth0 = configuration.GetSection("Authentication:Auth0");
        string? authority = auth0["Authority"];
        string? clientId = auth0["ClientId"];

        if (string.IsNullOrWhiteSpace(authority) || string.IsNullOrWhiteSpace(clientId))
            throw new InvalidOperationException(
                "Auth0 is not configured. Set Authentication:Auth0:Authority " +
                "(https://<tenant>.auth0.com/, including the trailing slash) and " +
                "Authentication:Auth0:ClientId.");

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Authority must match the token issuer exactly, trailing slash included; the
                // JWKS for signature validation is discovered from its OIDC metadata.
                options.Authority = authority;
                options.Audience = clientId;
                // Keep raw OIDC claim names (sub, iss, email, name) so CurrentUser reads are uniform.
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    NameClaimType = CurrentUser.NameClaim,
                };
            });

        return services;
    }
}
