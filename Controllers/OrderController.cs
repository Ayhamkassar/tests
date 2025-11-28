using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly Data.ApplicationDbContext _context;

        public OrderController(Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Orders.Include(o => o.User).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            var o = await _context.Orders.FindAsync(id);
            if (o == null) return NotFound();

            o.Status = status;
            await _context.SaveChangesAsync();
            return Ok(o);
        }
    }
}