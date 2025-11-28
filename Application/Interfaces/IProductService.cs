using SyriaZone.Models;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task<bool> DeleteAsync(int id);
}