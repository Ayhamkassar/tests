using SyriaZone.Data;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _db;
    public PaymentService(ApplicationDbContext db) => _db = db;

    public async Task<Payment> CreatePaymentAsync(Payment payment)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return payment;
    }

    public async Task<bool> ConfirmPaymentAsync(int id)
    {
        var p = await _db.Payments.FindAsync(id);
        if (p == null) return false;
        p.Status = "Success";
        await _db.SaveChangesAsync();
        return true;
    }
}