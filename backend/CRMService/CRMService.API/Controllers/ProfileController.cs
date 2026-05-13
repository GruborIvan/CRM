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
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new ArgumentException("User identity could not be determined from the token.");

        if (!Guid.TryParse(userIdClaim, out var userId))
            throw new ArgumentException("User identity could not be determined from the token.");

        var user = await _users.GetByIdAsync(userId, ct)
            ?? throw new ArgumentException($"No user found for the provided token.");

        return Ok(UserProfileDto.FromUser(user));
    }
}
