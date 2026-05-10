using CRMService.Application.Auth;
using CRMService.Application.Auth.DTOs;
using CRMService.Application.Common;
using CRMService.Application.Common.Exceptions;
using CRMService.Domain.Users;
using Moq;

namespace CRMService.UnitTests.Auth;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _users = new();
    private readonly Mock<IPasswordHasher> _hasher = new();
    private readonly Mock<ITokenService> _tokens = new();
    private readonly AuthService _sut;

    private static readonly (string Token, DateTime ExpiresAt) FakeAccess =
        ("access-token", DateTime.UtcNow.AddHours(1));
    private static readonly (string Token, DateTime ExpiresAt) FakeRefresh =
        ("refresh-token", DateTime.UtcNow.AddDays(7));

    public AuthServiceTests()
    {
        _tokens.Setup(t => t.CreateAccessToken(It.IsAny<User>())).Returns(FakeAccess);
        _tokens.Setup(t => t.CreateRefreshToken()).Returns(FakeRefresh);
        _sut = new AuthService(_users.Object, _hasher.Object, _tokens.Object);
    }

    [Fact]
    public async Task RegisterAsync_WhenUsernameAlreadyTaken_ThrowsConflictException()
    {
        var existing = User.Create("taken", "other@example.com", "hash");
        _users.Setup(r => r.GetByUsernameAsync("taken", default)).ReturnsAsync(existing);

        await Assert.ThrowsAsync<ConflictException>(
            () => _sut.RegisterAsync(new RegisterDto("taken", "new@example.com", "Password1!")));
    }

    [Fact]
    public async Task RegisterAsync_WhenEmailAlreadyInUse_ThrowsConflictException()
    {
        _users.Setup(r => r.GetByUsernameAsync("newuser", default)).ReturnsAsync((User?)null);
        var existing = User.Create("other", "taken@example.com", "hash");
        _users.Setup(r => r.GetByEmailAsync("taken@example.com", default)).ReturnsAsync(existing);

        await Assert.ThrowsAsync<ConflictException>(
            () => _sut.RegisterAsync(new RegisterDto("newuser", "taken@example.com", "Password1!")));
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_ReturnsTokenResponse()
    {
        _users.Setup(r => r.GetByUsernameAsync(It.IsAny<string>(), default)).ReturnsAsync((User?)null);
        _users.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), default)).ReturnsAsync((User?)null);
        _hasher.Setup(h => h.Hash(It.IsAny<string>())).Returns("hashed");

        var result = await _sut.RegisterAsync(new RegisterDto("newuser", "new@example.com", "Password1!"));

        Assert.Equal(FakeAccess.Token, result.AccessToken);
        Assert.Equal(FakeRefresh.Token, result.RefreshToken);
        Assert.Equal(FakeAccess.ExpiresAt, result.ExpiresAt);
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_AddsUserToRepository()
    {
        _users.Setup(r => r.GetByUsernameAsync(It.IsAny<string>(), default)).ReturnsAsync((User?)null);
        _users.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), default)).ReturnsAsync((User?)null);
        _hasher.Setup(h => h.Hash(It.IsAny<string>())).Returns("hashed");

        await _sut.RegisterAsync(new RegisterDto("newuser", "new@example.com", "Password1!"));

        _users.Verify(r => r.AddAsync(
            It.Is<User>(u => u.Username == "newuser" && u.Email == "new@example.com"), default), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WhenUserNotFound_ThrowsUnauthorizedException()
    {
        _users.Setup(r => r.GetByUsernameAsync("unknown", default)).ReturnsAsync((User?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _sut.LoginAsync(new LoginDto("unknown", "Password1!")));
    }

    [Fact]
    public async Task LoginAsync_WhenPasswordInvalid_ThrowsUnauthorizedException()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        _users.Setup(r => r.GetByUsernameAsync("alice", default)).ReturnsAsync(user);
        _hasher.Setup(h => h.Verify("wrongpassword", "hash")).Returns(false);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _sut.LoginAsync(new LoginDto("alice", "wrongpassword")));
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsTokenResponse()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        _users.Setup(r => r.GetByUsernameAsync("alice", default)).ReturnsAsync(user);
        _hasher.Setup(h => h.Verify("Password1!", "hash")).Returns(true);

        var result = await _sut.LoginAsync(new LoginDto("alice", "Password1!"));

        Assert.Equal(FakeAccess.Token, result.AccessToken);
        Assert.Equal(FakeRefresh.Token, result.RefreshToken);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_UpdatesRefreshToken()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        _users.Setup(r => r.GetByUsernameAsync("alice", default)).ReturnsAsync(user);
        _hasher.Setup(h => h.Verify("Password1!", "hash")).Returns(true);

        await _sut.LoginAsync(new LoginDto("alice", "Password1!"));

        _users.Verify(r => r.UpdateAsync(
            It.Is<User>(u => u.RefreshToken == FakeRefresh.Token), default), Times.Once);
    }

    [Fact]
    public async Task RefreshAsync_WhenTokenNotFound_ThrowsUnauthorizedException()
    {
        _users.Setup(r => r.GetByRefreshTokenAsync("bad-token", default)).ReturnsAsync((User?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _sut.RefreshAsync(new RefreshTokenDto("bad-token")));
    }

    [Fact]
    public async Task RefreshAsync_WhenTokenExpired_ThrowsUnauthorizedException()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("expired-token", DateTime.UtcNow.AddDays(-1));
        _users.Setup(r => r.GetByRefreshTokenAsync("expired-token", default)).ReturnsAsync(user);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _sut.RefreshAsync(new RefreshTokenDto("expired-token")));
    }

    [Fact]
    public async Task RefreshAsync_WithValidToken_ReturnsNewTokenResponse()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("valid-token", DateTime.UtcNow.AddDays(7));
        _users.Setup(r => r.GetByRefreshTokenAsync("valid-token", default)).ReturnsAsync(user);

        var result = await _sut.RefreshAsync(new RefreshTokenDto("valid-token"));

        Assert.Equal(FakeAccess.Token, result.AccessToken);
        Assert.Equal(FakeRefresh.Token, result.RefreshToken);
    }

    [Fact]
    public async Task RefreshAsync_WithValidToken_UpdatesUserRefreshToken()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("valid-token", DateTime.UtcNow.AddDays(7));
        _users.Setup(r => r.GetByRefreshTokenAsync("valid-token", default)).ReturnsAsync(user);

        await _sut.RefreshAsync(new RefreshTokenDto("valid-token"));

        _users.Verify(r => r.UpdateAsync(
            It.Is<User>(u => u.RefreshToken == FakeRefresh.Token), default), Times.Once);
    }
}
