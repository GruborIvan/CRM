using CRMService.Application.Users.DTOs;
using CRMService.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CRMService.API.Controllers;

[Authorize]
[ApiController]
[Route("profile")]
public class ProfileController : ControllerBase
{
    private readonly IUserRepository _users;

    public ProfileController(IUserRepository users)
    {
        _users = users;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        var user = await ResolveUserAsync(ct);
        return Ok(UserProfileDto.FromUser(user));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto, CancellationToken ct)
    {
        if (dto.FirstName is null && dto.LastName is null && dto.Email is null)
            throw new ArgumentException("At least one field must be provided for update.");

        var user = await ResolveUserAsync(ct);

        user.UpdateProfile(dto.FirstName, dto.LastName, dto.Email);
        await _users.UpdateAsync(user, ct);

        return Ok(UserProfileDto.FromUser(user));
    }

    private async Task<User> ResolveUserAsync(CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new ArgumentException("User identity could not be determined from the token.");

        if (!Guid.TryParse(userIdClaim, out var userId))
            throw new ArgumentException("User identity could not be determined from the token.");

        return await _users.GetByIdAsync(userId, ct)
            ?? throw new ArgumentException("No user found for the provided token.");
    }
}
