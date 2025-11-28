using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;

public class RatingService : IRatingService
{
    private readonly ApplicationDbContext _db;
    public RatingService(ApplicationDbContext db) => _db = db;

    public async Task<bool> AddRatingAsync(ProductRating rating)
    {
        _db.ProductRatings.Add(rating);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductRating>> GetRatingsAsync(int productId)
    {
        return await _db.ProductRatings
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<double> GetAverageAsync(int productId)
    {
        return await _db.ProductRatings
            .Where(r => r.ProductId == productId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;
    }
}
