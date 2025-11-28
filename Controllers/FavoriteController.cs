using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoriteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFavorites(int userId)
        {
            var data = await _context.Favorites
                .Include(f => f.Product)
                .Where(f => f.UserId == userId)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Add(Favorite fav)
        {
            _context.Favorites.Add(fav);
            await _context.SaveChangesAsync();
            return Ok(fav);
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(int userId, int productId)
        {
            var fav = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

            if (fav == null) return NotFound();

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}