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

    // Captured the first time a user signs in, via the onboarding gate. Email/DisplayName come
    // from the token; these are FinPlan-owned and edited by the user, not refreshed on login.
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }

    // The onboarding gate is satisfied once both names are filled in.
    public bool ProfileCompleted =>
        !string.IsNullOrWhiteSpace(FirstName) && !string.IsNullOrWhiteSpace(LastName);

    // The user's personal owner (Kind=Personal): the owner all their private finances belong to,
    // and their default active context. Created together with the user; EF stamps OwnerId from
    // the navigation on insert. Set in the factory, not the constructor — EF binds only mapped
    // scalars to constructor parameters, so the materialization ctor stays scalar-only.
    public int OwnerId { get; private set; }
    public Owner Owner { get; private set; } = null!;

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

        return new User(issuer, externalSubject, email, displayName) { Owner = Owner.Personal() };
    }

    // Refreshed from token claims on login; the (Issuer, ExternalSubject) identity never changes here.
    public void UpdateProfile(string? email, string? displayName)
    {
        Email = email;
        DisplayName = displayName;
    }

    // Set by the user through the first-login onboarding gate (and editable later).
    public Result CompleteProfile(string firstName, string lastName)
    {
        Result validationResult = ValidateNames(firstName, lastName);

        if (validationResult.IsFailed)
            return validationResult;

        FirstName = firstName.Trim();
        LastName = lastName.Trim();

        return Result.Ok();
    }

    private static Result ValidateNames(string firstName, string lastName)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(firstName))
            result.WithError("First name cannot be empty.");

        if (string.IsNullOrWhiteSpace(lastName))
            result.WithError("Last name cannot be empty.");

        return result;
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
