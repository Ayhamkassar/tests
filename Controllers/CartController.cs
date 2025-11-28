using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly Data.ApplicationDbContext _context;

        public CartController(Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var data = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CartItem item)
        {
            var exists = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == item.UserId && c.ProductId == item.ProductId);

            if (exists != null)
            {
                exists.Quantity += item.Quantity;
            }
            else
            {
                _context.CartItems.Add(item);
            }

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var item = await _context.CartItems.FindAsync(id);
            if (item == null) return NotFound();
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
