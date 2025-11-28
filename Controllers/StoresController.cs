using Microsoft.AspNetCore.Mvc;
using SyriaZone.Data;
using System.Linq;
using System.Threading.Tasks;
using SyriaZone.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class StoresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StoresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateStore(Store store)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == store.UserId);
        if (user == null) return BadRequest("المستخدم مش موجود.");
        if (user.HasAStore) return BadRequest("هالمستخدم عنده متجر بالفعل.");

        _context.Stores.Add(store);
        user.HasAStore = true;
        await _context.SaveChangesAsync();

        return Ok(store);
    }

    [HttpGet("user/{userId}")]
    public IActionResult GetStoreByUser(int userId)
    {
        var store = _context.Stores
            .Include(s => s.User)
            .FirstOrDefault(s => s.UserId == userId);
        if (store == null) return NotFound();
        return Ok(store);
    }

    [HttpPut("update/{userId}")]
    public async Task<IActionResult> UpdateStore(int userId, Store updatedStore)
    {
        var store = _context.Stores.FirstOrDefault(s => s.UserId == userId);
        if (store == null) return NotFound();

        store.Name = updatedStore.Name;
        store.Description = updatedStore.Description;
        store.Logo = updatedStore.Logo;
        store.Phone = updatedStore.Phone;
        store.LastUpdatedAt = updatedStore.LastUpdatedAt;

        await _context.SaveChangesAsync();
        return Ok(store);
    }

    [HttpDelete("delete/{userId}")]
    public async Task<IActionResult> DeleteStore(int userId)
    {
        var store = _context.Stores.FirstOrDefault(s => s.UserId == userId);
        if (store == null) return NotFound();

        _context.Stores.Remove(store);
        var user = _context.Users.FirstOrDefault(u => u.Id == userId);
        if (user != null) user.HasAStore = false;

        await _context.SaveChangesAsync();
        return Ok();
    }
    [HttpGet("all")]
    public IActionResult GetAllStores()
    {
        var stores = _context.Stores
            .Include(s => s.User)
            .OrderBy(s => s.Id)
            .ToList();

        if (stores == null || stores.Count == 0)
            return NotFound("لا توجد متاجر.");

        return Ok(stores);
    }

}
