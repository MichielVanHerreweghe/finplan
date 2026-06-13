using FinPlan.Domain.Groups;

namespace FinPlan.Api.Security;

// Resolves and AUTHORIZES the effective owner the request's data is scoped to, then stashes it
// for HttpCurrentOwnerProvider. Runs right after JitProvisioningMiddleware (which set the acting
// user + personal owner). Reads only unfiltered tables (Group/GroupMember), so it has no circular
// dependency on the owner query filter it ultimately feeds.
//
// Resolution:
//   - no X-Active-Owner header            -> personal owner (the default context)
//   - header == personal owner            -> personal owner
//   - header is a group owner the user belongs to -> that group owner
//   - anything else                       -> 403 (fail closed: never silently fall back, or a user
//                                            could believe they're acting in a group while writing
//                                            to their personal finances or vice versa)
public sealed class ActiveContextMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IGroupRepository groups)
    {
        if (context.Items.TryGetValue(CurrentUser.UserIdItemKey, out object? userValue)
            && userValue is int userId && userId != 0
            && context.Items.TryGetValue(CurrentUser.PersonalOwnerIdItemKey, out object? personalValue)
            && personalValue is int personalOwnerId)
        {
            int? requested = ParseRequestedOwner(context);

            if (requested is null || requested == personalOwnerId)
            {
                context.Items[CurrentUser.ActiveOwnerIdItemKey] = personalOwnerId;
            }
            else if (await groups.IsMemberOfOwnerAsync(requested.Value, userId, context.RequestAborted))
            {
                context.Items[CurrentUser.ActiveOwnerIdItemKey] = requested.Value;
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Not a member of the requested context.");
                return;
            }
        }

        await next(context);
    }

    private static int? ParseRequestedOwner(HttpContext context)
    {
        string? header = context.Request.Headers[CurrentUser.ActiveOwnerHeader];
        return int.TryParse(header, out int ownerId) && ownerId > 0 ? ownerId : null;
    }
}
