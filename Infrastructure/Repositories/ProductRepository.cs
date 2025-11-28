using Microsoft.EntityFrameworkCore;
using SyriaZone.Data;
using SyriaZone.Models;

public class ProductRepository : IProductService
{
    private readonly ApplicationDbContext _db;
    public ProductRepository(ApplicationDbContext db) => _db = db;

    public async Task<Product> CreateAsync(Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return false;
        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
        => await _db.Products.ToListAsync();

    public async Task<Product> GetByIdAsync(int id)
        => await _db.Products.FindAsync(id);
}
