using FinPlan.Domain.SavingGoals;
using FluentResults;
using Xunit;

namespace FinPlan.Domain.Tests.SavingGoals;

public class SavingGoalTests
{
    private static SavingGoal NewGoal(decimal target = 900m, DateOnly? deadline = null)
    {
        Result<SavingGoal> result = SavingGoal.Create("Holiday", "Trip to Italy", target, deadline);
        Assert.True(result.IsSuccess);
        return result.Value;
    }

    [Fact]
    public void Create_WithEmptyName_Fails()
    {
        Result<SavingGoal> result = SavingGoal.Create("  ", null, 100m, null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void Create_WithNonPositiveTarget_Fails()
    {
        Result<SavingGoal> result = SavingGoal.Create("Car", null, 0m, null);

        Assert.True(result.IsFailed);
    }

    [Fact]
    public void AddContribution_WithNonPositiveAmount_Fails()
    {
        SavingGoal goal = NewGoal();

        Result result = goal.AddContribution(0m, new DateOnly(2026, 1, 1));

        Assert.True(result.IsFailed);
        Assert.Empty(goal.Contributions);
    }

    [Fact]
    public void SavedAndRemaining_SumContributions()
    {
        SavingGoal goal = NewGoal(target: 1000m);

        goal.AddContribution(200m, new DateOnly(2026, 1, 1));
        goal.AddContribution(300m, new DateOnly(2026, 2, 1));

        Assert.Equal(500m, goal.SavedAmount);
        Assert.Equal(500m, goal.RemainingAmount);
        Assert.False(goal.IsCompleted);
    }

    [Fact]
    public void RequiredContributions_WithNoDeadline_ReturnsNull()
    {
        SavingGoal goal = NewGoal(deadline: null);

        Assert.Null(goal.RequiredContributions(new DateOnly(2026, 1, 1)));
    }

    [Fact]
    public void RequiredContributions_WithFutureDeadline_ComputesMonthlyAndWeekly()
    {
        // 900 target, nothing saved, 90 days until the deadline (Jan 1 -> Apr 1).
        SavingGoal goal = NewGoal(target: 900m, deadline: new DateOnly(2026, 4, 1));

        SavingsContributionPlan? plan = goal.RequiredContributions(new DateOnly(2026, 1, 1));

        Assert.NotNull(plan);
        Assert.False(plan!.IsOverdue);
        // 90 days -> 3 whole months -> 900 / 3 = 300.00
        Assert.Equal(300m, plan.PerMonth);
        // 90 days -> ceil(90/7) = 13 weeks -> 900 / 13 = 69.2307... rounded up to the cent.
        Assert.Equal(69.24m, plan.PerWeek);
    }

    [Fact]
    public void RequiredContributions_WhenCompleted_ReturnsZero()
    {
        SavingGoal goal = NewGoal(target: 100m, deadline: new DateOnly(2026, 12, 1));
        goal.AddContribution(100m, new DateOnly(2026, 1, 1));

        SavingsContributionPlan? plan = goal.RequiredContributions(new DateOnly(2026, 1, 1));

        Assert.NotNull(plan);
        Assert.Equal(0m, plan!.PerMonth);
        Assert.Equal(0m, plan.PerWeek);
        Assert.False(plan.IsOverdue);
        Assert.True(goal.IsCompleted);
    }

    [Fact]
    public void RequiredContributions_WhenDeadlinePassedWithMoneyOwed_IsOverdueAndNeededNow()
    {
        SavingGoal goal = NewGoal(target: 500m, deadline: new DateOnly(2026, 1, 1));

        SavingsContributionPlan? plan = goal.RequiredContributions(new DateOnly(2026, 6, 1));

        Assert.NotNull(plan);
        Assert.True(plan!.IsOverdue);
        Assert.Equal(500m, plan.PerMonth);
        Assert.Equal(500m, plan.PerWeek);
    }

    [Fact]
    public void RequiredContributions_WhenDeadlineIsToday_NeededNowButNotOverdue()
    {
        DateOnly today = new(2026, 6, 1);
        SavingGoal goal = NewGoal(target: 500m, deadline: today);

        SavingsContributionPlan? plan = goal.RequiredContributions(today);

        Assert.NotNull(plan);
        Assert.False(plan!.IsOverdue);
        Assert.Equal(500m, plan.PerMonth);
        Assert.Equal(500m, plan.PerWeek);
    }
}
