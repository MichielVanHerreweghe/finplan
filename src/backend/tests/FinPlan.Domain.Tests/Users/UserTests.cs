using FinPlan.Domain.Users;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Users;

public class UserTests
{
    private static User NewUser() =>
        User.Create("https://issuer/", "subject", "user@example.com", "User").Value;

    [Fact]
    public void NewUser_ProfileIsNotCompleted()
    {
        User user = NewUser();

        Assert.False(user.ProfileCompleted);
    }

    [Fact]
    public void CompleteProfile_SetsNames_AndMarksCompleted()
    {
        User user = NewUser();

        Result result = user.CompleteProfile("  Ada  ", "  Lovelace  ");

        Assert.True(result.IsSuccess);
        Assert.Equal("Ada", user.FirstName);
        Assert.Equal("Lovelace", user.LastName);
        Assert.True(user.ProfileCompleted);
    }

    [Theory]
    [InlineData("", "Lovelace")]
    [InlineData("Ada", "  ")]
    public void CompleteProfile_WithMissingName_Fails(string firstName, string lastName)
    {
        User user = NewUser();

        Result result = user.CompleteProfile(firstName, lastName);

        Assert.True(result.IsFailed);
        Assert.False(user.ProfileCompleted);
    }
}
