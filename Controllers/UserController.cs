using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Helpers;
using SyriaZone.Models;
using System.Security.Cryptography;
using System.Text;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly Data.ApplicationDbContext _context;
        private readonly JwtService _jwt;

        public UserController(Data.ApplicationDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            user.PasswordHash = Hash(user.PasswordHash);
            user.HasAStore = false;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user == null) return Unauthorized("User not found");
            if (user.PasswordHash != Hash(login.PasswordHash)) return Unauthorized("Wrong password");

            var token = _jwt.GenerateToken(user);
            return Ok(new { token, userId = user.Id,role = user.Role,hasAStore=user.HasAStore });
        }


        private string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(bytes).Replace("-", "");
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(string token)
        {
            var rt = await _context.RefreshTokens.Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked);

            if (rt == null || rt.ExpiresAt < DateTime.Now)
                return Unauthorized("Invalid refresh token");

            var newJwt = _jwt.GenerateToken(rt.User);
            return Ok(new { token = newJwt });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                hasAStore = user.HasAStore,
                role = user.Role,
                createdAt = user.CreatedAt
            });
        }
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var stores = _context.Users
                .OrderBy(s => s.Id)
                .ToList();

            if (stores == null || stores.Count == 0)
                return NotFound("لا توجد متاجر.");

            return Ok(stores);
        }
    }
}