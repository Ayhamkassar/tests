using Microsoft.AspNetCore.Mvc;
using SyriaZone.Models;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    public ProductsController(IProductService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProductDto dto)
    {
        var newProduct = await _service.CreateAsync(new Product
        {
            Title = dto.Name,
            Description = dto.Description,
            Price = (double)dto.Price,
            CategoryId = dto.CategoryId
        });
        return Ok(newProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? Ok() : NotFound();
}