using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly Data.ApplicationDbContext _context;

        public ProductController(Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Products.Include(p => p.Category).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            p.Title = product.Title;
            p.Description = product.Description;
            p.Price = product.Price;
            p.CategoryId = product.CategoryId;
            p.ImageUrls = product.ImageUrls;

            await _context.SaveChangesAsync();
            return Ok(p);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            _context.Products.Remove(p);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
