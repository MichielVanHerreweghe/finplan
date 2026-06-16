using FluentValidation;

namespace FinPlan.Application.Users.Commands.CompleteProfile;

public sealed class CompleteProfileValidator : AbstractValidator<CompleteProfileCommand>
{
    public CompleteProfileValidator()
    {
        RuleFor(command => command.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(command => command.LastName).NotEmpty().MaximumLength(100);
    }
}
