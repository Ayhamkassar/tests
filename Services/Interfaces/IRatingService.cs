public interface IRatingService
{
    Task<bool> AddRatingAsync(ProductRating rating);
    Task<List<ProductRating>> GetRatingsAsync(int productId);
    Task<double> GetAverageAsync(int productId);
}


