using FinPlan.Domain.Pockets;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.Pockets;

public class PocketTests
{
    [Fact]
    public void Create_WithEmptyName_Fails()
    {
        Result<Pocket> result = Pocket.Create("  ", null, null, 0m);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_TopLevel_Succeeds()
    {
        Result<Pocket> result = Pocket.Create("Checking", "Day-to-day", null, 0m);

        Assert.True(result.IsSuccess);
        Assert.Null(result.Value.ParentPocketId);
    }

    [Fact]
    public void Create_WithParent_Succeeds()
    {
        Result<Pocket> result = Pocket.Create("Vacation", null, parentPocketId: 5, startingAmount: 0m);

        Assert.True(result.IsSuccess);
        Assert.Equal(5, result.Value.ParentPocketId);
    }

    [Fact]
    public void Create_WithNonPositiveParent_Fails()
    {
        Result<Pocket> result = Pocket.Create("Vacation", null, parentPocketId: 0, startingAmount: 0m);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithStartingAmount_Succeeds()
    {
        Result<Pocket> result = Pocket.Create("Savings", null, null, startingAmount: 250m);

        Assert.True(result.IsSuccess);
        Assert.Equal(250m, result.Value.StartingAmount);
    }

    [Fact]
    public void Create_WithNegativeStartingAmount_Fails()
    {
        Result<Pocket> result = Pocket.Create("Savings", null, null, startingAmount: -1m);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Update_ChangesValues()
    {
        Pocket pocket = Pocket.Create("Old", null, null, 0m).Value;

        Result result = pocket.Update("New", "desc", 3, 50m);

        Assert.True(result.IsSuccess);
        Assert.Equal("New", pocket.Name);
        Assert.Equal(3, pocket.ParentPocketId);
        Assert.Equal(50m, pocket.StartingAmount);
    }
}
