namespace FinPlan.Api.Security;

// On each authenticated request, ensures a local User row exists for the token's identity and
// stashes the resolved internal user id in HttpContext.Items for the owner provider to read.
// Runs after authentication; anonymous requests pass straight through (no owner = empty reads).
public sealed class JitProvisioningMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IUserProvisioningService provisioning)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            string? subject = context.User.Subject();
            string? issuer = context.User.Issuer();

            if (!string.IsNullOrEmpty(subject) && !string.IsNullOrEmpty(issuer))
            {
                ProvisionedUser provisioned = await provisioning.EnsureProvisionedAsync(
                    issuer, subject, context.User.Email(), context.User.DisplayName(),
                    context.RequestAborted);

                context.Items[CurrentUser.UserIdItemKey] = provisioned.UserId;
                context.Items[CurrentUser.PersonalOwnerIdItemKey] = provisioned.PersonalOwnerId;
            }
        }

        await next(context);
    }
}
