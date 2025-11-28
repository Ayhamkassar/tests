public interface IPaymentService
{
    Task<Payment> CreatePaymentAsync(Payment payment);
    Task<bool> ConfirmPaymentAsync(int id);
}