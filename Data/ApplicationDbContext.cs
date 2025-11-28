using Microsoft.EntityFrameworkCore;
using SyriaZone.Models;

namespace SyriaZone.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
         public DbSet<Payment> Payments { get; set; }
         public DbSet<ProductRating> ProductRatings { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Store> Stores { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
            .Property(p => p.ImageUrls)
            .HasConversion(
                v => string.Join(";", v),
                v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList()
            );  
        }
    }
}
