using System.Security.Claims;

namespace FinPlan.Api.Security;

// Shared knowledge of how the authenticated user is represented across a request:
//   - which JWT claims carry the identity (raw OIDC names; MapInboundClaims is disabled)
//   - the HttpContext.Items slot the just-in-time-resolved internal user id is stashed in
//
// The resolved id lives in HttpContext.Items (not a scoped service) because HotChocolate
// DataLoaders run in a child DI scope; IHttpContextAccessor flows the same HttpContext into
// that scope, so Items is the one place every scope can read the same owner from.
public static class CurrentUser
{
    public const string UserIdItemKey = "FinPlan:UserId";

    // The user's personal owner id, stashed at provisioning so the active-context resolver can
    // default to it without an extra query.
    public const string PersonalOwnerIdItemKey = "FinPlan:PersonalOwnerId";

    // The effective owner the request's data is scoped to (personal or a group the user belongs
    // to), resolved by ActiveContextMiddleware. HttpCurrentOwnerProvider reads this slot.
    public const string ActiveOwnerIdItemKey = "FinPlan:ActiveOwnerId";

    // Header by which the frontend selects its active context (an owner id). Absent => personal.
    public const string ActiveOwnerHeader = "X-Active-Owner";

    public const string SubjectClaim = "sub";
    public const string IssuerClaim = "iss";
    public const string EmailClaim = "email";
    public const string NameClaim = "name";

    public static string? Subject(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(SubjectClaim);

    public static string? Issuer(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(IssuerClaim);

    public static string? Email(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(EmailClaim);

    public static string? DisplayName(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(NameClaim);
}
