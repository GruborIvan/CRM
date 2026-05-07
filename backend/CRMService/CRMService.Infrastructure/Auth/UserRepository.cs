using CRMService.Domain.Users;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Auth;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(CrmDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(u => u.Username == username, ct);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, ct);
}
