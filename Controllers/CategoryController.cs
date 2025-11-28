using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

namespace SyriaZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly Data.ApplicationDbContext _context;

        public CategoryController(Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Categories.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }
    }
}