using FinPlan.Domain.Contacts;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Contacts;

public class ContactTests
{
    [Fact]
    public void Create_LinksOwnerToContact()
    {
        Result<Contact> result = Contact.Create(ownerUserId: 1, contactUserId: 2);

        Assert.True(result.IsSuccess);
        Assert.Equal(1, result.Value.OwnerUserId);
        Assert.Equal(2, result.Value.ContactUserId);
    }

    [Fact]
    public void Create_AddingYourself_Fails()
    {
        Result<Contact> result = Contact.Create(ownerUserId: 1, contactUserId: 1);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithInvalidOwner_Fails()
    {
        Result<Contact> result = Contact.Create(ownerUserId: 0, contactUserId: 2);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithInvalidContact_Fails()
    {
        Result<Contact> result = Contact.Create(ownerUserId: 1, contactUserId: 0);

        Assert.True(result.IsFailed);
    }
}
