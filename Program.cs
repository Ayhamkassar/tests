using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SyriaZone.Data;
using SyriaZone.Helpers;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IRatingService, RatingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddRateLimiter(options => options.AddFixedWindowLimiter("default", o =>
 {
     o.Window = TimeSpan.FromSeconds(10);
     o.PermitLimit = 30;
 }));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SyriaZone API v1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRateLimiter();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (ctx, next) =>
{
    ctx.Response.Headers.Remove("Server");
    await next();
});
app.UseAuthorization();
app.UseCors();
app.MapControllers();
app.MapRazorPages();
app.UseStaticFiles();
app.Run();



