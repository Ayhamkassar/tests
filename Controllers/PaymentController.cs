using Microsoft.AspNetCore.Mvc;
using SyriaZone.Data;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public PaymentController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("create")] // For React Native
    public async Task<IActionResult> CreatePayment([FromBody] Payment dto)
    {
        _db.Payments.Add(dto);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Payment created", paymentId = dto.Id });
    }

    [HttpPost("confirm/{id}")]
    public async Task<IActionResult> Confirm(int id)
    {
        var p = await _db.Payments.FindAsync(id);
        if (p == null) return NotFound();
        p.Status = "Success";
        await _db.SaveChangesAsync();
        return Ok(new { message = "Payment confirmed" });
    }
}