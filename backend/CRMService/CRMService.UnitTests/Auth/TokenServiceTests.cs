using CRMService.Domain.Users;
using CRMService.Infrastructure.Auth;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CRMService.UnitTests.Auth;

public class TokenServiceTests
{
    private const int ExpiryMinutes = 60;
    private const int RefreshExpiryDays = 7;

    private readonly TokenService _sut;

    public TokenServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-secret-jwt-key-minimum-32-characters-long!",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:ExpiresInMinutes"] = ExpiryMinutes.ToString(),
                ["Jwt:RefreshTokenExpiresInDays"] = RefreshExpiryDays.ToString()
            })
            .Build();

        _sut = new TokenService(config);
    }

    [Fact]
    public void CreateAccessToken_ReturnsNonEmptyToken()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        var (token, _) = _sut.CreateAccessToken(user);

        Assert.NotEmpty(token);
    }

    [Fact]
    public void CreateAccessToken_ExpiresAt_IsApproximatelyCorrect()
    {
        var before = DateTime.UtcNow;
        var user = User.Create("alice", "alice@example.com", "hash");

        var (_, expiresAt) = _sut.CreateAccessToken(user);

        var expected = before.AddMinutes(ExpiryMinutes);
        Assert.InRange(expiresAt, expected.AddSeconds(-5), expected.AddSeconds(5));
    }

    [Fact]
    public void CreateAccessToken_ContainsUserClaims()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        var (token, _) = _sut.CreateAccessToken(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Equal(user.Id.ToString(), jwt.Subject);
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Name && c.Value == "alice");
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Email && c.Value == "alice@example.com");
    }

    [Fact]
    public void CreateAccessToken_HasCorrectIssuerAndAudience()
    {
        var user = User.Create("alice", "alice@example.com", "hash");

        var (token, _) = _sut.CreateAccessToken(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Equal("TestIssuer", jwt.Issuer);
        Assert.Contains("TestAudience", jwt.Audiences);
    }

    [Fact]
    public void CreateRefreshToken_ReturnsNonEmptyToken()
    {
        var (token, _) = _sut.CreateRefreshToken();

        Assert.NotEmpty(token);
    }

    [Fact]
    public void CreateRefreshToken_TokenIsValidBase64Of64Bytes()
    {
        var (token, _) = _sut.CreateRefreshToken();

        var bytes = Convert.FromBase64String(token);
        Assert.Equal(64, bytes.Length);
    }

    [Fact]
    public void CreateRefreshToken_ExpiresAt_IsApproximatelyCorrect()
    {
        var before = DateTime.UtcNow;

        var (_, expiresAt) = _sut.CreateRefreshToken();

        var expected = before.AddDays(RefreshExpiryDays);
        Assert.InRange(expiresAt, expected.AddSeconds(-5), expected.AddSeconds(5));
    }

    [Fact]
    public void CreateRefreshToken_ReturnsDifferentTokensOnEachCall()
    {
        var (token1, _) = _sut.CreateRefreshToken();
        var (token2, _) = _sut.CreateRefreshToken();

        Assert.NotEqual(token1, token2);
    }
}
