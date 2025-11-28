using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public RatingController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("add")] // For React Native
    public async Task<IActionResult> AddRating([FromBody] ProductRating dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        _db.ProductRatings.Add(dto);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Rating submitted" });
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetProductRatings(int productId)
    {
        var ratings = await _db.ProductRatings
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .ToListAsync();

        return Ok(ratings);
    }

    [HttpGet("avg/{productId}")]
    public async Task<IActionResult> GetAverageRating(int productId)
    {
        var avg = await _db.ProductRatings
            .Where(r => r.ProductId == productId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;

        return Ok(new { average = avg });
    }
}