using CRMService.Domain.Users;

namespace CRMService.UnitTests.Auth;

public class UserEntityTests
{
    [Fact]
    public void Create_WithValidData_ReturnsUser()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        Assert.Equal("alice", user.Username);
        Assert.Equal("alice@example.com", user.Email);
        Assert.Equal("hash", user.PasswordHash);
        Assert.NotEqual(Guid.Empty, user.Id);
    }

    [Theory]
    [InlineData("", "alice@example.com", "hash")]
    [InlineData("   ", "alice@example.com", "hash")]
    [InlineData("alice", "", "hash")]
    [InlineData("alice", "   ", "hash")]
    [InlineData("alice", "alice@example.com", "")]
    [InlineData("alice", "alice@example.com", "   ")]
    public void Create_WithBlankArgument_ThrowsArgumentException(
        string username, string email, string passwordHash)
    {
        Assert.Throws<ArgumentException>(() => User.Create(username, email, passwordHash));
    }

    [Fact]
    public void SetRefreshToken_SetsTokenAndExpiry()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        var expiry = DateTime.UtcNow.AddDays(7);

        user.SetRefreshToken("my-token", expiry);

        Assert.Equal("my-token", user.RefreshToken);
        Assert.Equal(expiry, user.RefreshTokenExpiresAt);
    }

    [Fact]
    public void SetRefreshToken_MarksUpdatedAt()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        user.SetRefreshToken("my-token", DateTime.UtcNow.AddDays(7));

        Assert.NotNull(user.UpdatedAt);
    }

    [Fact]
    public void RevokeRefreshToken_ClearsTokenAndExpiry()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("my-token", DateTime.UtcNow.AddDays(7));

        user.RevokeRefreshToken();

        Assert.Null(user.RefreshToken);
        Assert.Null(user.RefreshTokenExpiresAt);
    }

    [Fact]
    public void IsRefreshTokenValid_WhenTokenMatchesAndNotExpired_ReturnsTrue()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("my-token", DateTime.UtcNow.AddDays(7));

        Assert.True(user.IsRefreshTokenValid("my-token"));
    }

    [Fact]
    public void IsRefreshTokenValid_WhenTokenDoesNotMatch_ReturnsFalse()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("correct-token", DateTime.UtcNow.AddDays(7));

        Assert.False(user.IsRefreshTokenValid("wrong-token"));
    }

    [Fact]
    public void IsRefreshTokenValid_WhenTokenExpired_ReturnsFalse()
    {
        var user = User.Create("alice", "alice@example.com", "hash");
        user.SetRefreshToken("my-token", DateTime.UtcNow.AddDays(-1));

        Assert.False(user.IsRefreshTokenValid("my-token"));
    }

    [Fact]
    public void IsRefreshTokenValid_WhenNoTokenSet_ReturnsFalse()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        Assert.False(user.IsRefreshTokenValid("any-token"));
    }
}
