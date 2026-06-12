using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Users;

// A local account provisioned just-in-time on first authenticated request. It is the
// owner every other aggregate is scoped to. Deliberately NOT an OwnedEntity: it must be
// readable/creatable before an owner id exists, which is what resolves the JIT chicken-and-egg.
public sealed class User : Entity, IAggregateRoot
{
    // Stable identity from the OIDC provider: the token issuer plus its subject claim.
    // Email can change over a user's lifetime and is intentionally not the key.
    public string Issuer { get; private set; }
    public string ExternalSubject { get; private set; }
    public string? Email { get; private set; }
    public string? DisplayName { get; private set; }

    private User(string issuer, string externalSubject, string? email, string? displayName)
    {
        Issuer = issuer;
        ExternalSubject = externalSubject;
        Email = email;
        DisplayName = displayName;
    }

    public static Result<User> Create(string issuer, string externalSubject, string? email, string? displayName)
    {
        Result validationResult = Validate(issuer, externalSubject);

        if (validationResult.IsFailed)
            return validationResult;

        return new User(issuer, externalSubject, email, displayName);
    }

    // Refreshed from token claims on login; the (Issuer, ExternalSubject) identity never changes here.
    public void UpdateProfile(string? email, string? displayName)
    {
        Email = email;
        DisplayName = displayName;
    }

    private static Result Validate(string issuer, string externalSubject)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(issuer))
            result.WithError("Issuer cannot be empty.");

        if (string.IsNullOrWhiteSpace(externalSubject))
            result.WithError("Subject cannot be empty.");

        return result;
    }
}
