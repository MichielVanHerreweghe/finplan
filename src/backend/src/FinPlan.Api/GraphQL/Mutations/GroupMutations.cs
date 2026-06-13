using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Groups.Commands.AddGroupMember;
using FinPlan.Application.Groups.Commands.CreateGroup;
using FinPlan.Application.Groups.Commands.DeleteGroup;
using FinPlan.Application.Groups.Commands.LeaveGroup;
using FinPlan.Application.Groups.Commands.RemoveGroupMember;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Returns the new group's owner id so the client can switch its active context straight to it.
    [UseMutationConvention(PayloadFieldName = "ownerId")]
    public async Task<int> CreateGroup(
        CreateGroupInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new CreateGroupCommand(input.Name, input.Description), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> AddGroupMember(
        AddGroupMemberInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new AddGroupMemberCommand(input.GroupId, input.Email), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> RemoveGroupMember(
        RemoveGroupMemberInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new RemoveGroupMemberCommand(input.GroupId, input.UserId), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> LeaveGroup(
        int groupId, ISender sender, CancellationToken ct) =>
        (await sender.Send(new LeaveGroupCommand(groupId), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteGroup(
        int groupId, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteGroupCommand(groupId), ct)).Unwrap();
}
