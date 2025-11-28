using SyriaZone.Models;

public class Payment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending – Success – Failed
    public User User { get; set; }
}
