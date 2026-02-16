using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.Data;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("SalaoDb");
builder.Services.AddDbContext<SalaoContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,

        ValidateLifetime = true, 
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();
builder.Services.AddScoped<FechamentoService>();
builder.Services.AddScoped<ServicoService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<FuncionarioService>();
builder.Services.AddScoped<DespesaService>();
builder.Services.AddScoped<TipoServicoService>();
builder.Services.AddScoped<LucroService>();
builder.Services.AddScoped<EmailService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Salão API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Bearer {seu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

app.UseCors("AllCors");


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    for (int i = 0; i < 30; i++)
    {
        try
        {
            var context = services.GetRequiredService<SalaoContext>();
            var config = services.GetRequiredService<IConfiguration>();
            var connStr = config.GetConnectionString("SalaoDb");

            var builderMaster = new SqlConnectionStringBuilder(connStr);
            string dbName = builderMaster.InitialCatalog;
            builderMaster.InitialCatalog = "master";

            using (var connection = new SqlConnection(builderMaster.ConnectionString))
            {
                connection.Open();
                
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = $@"
                        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '{dbName}')
                        BEGIN
                            CREATE DATABASE [{dbName}];
                        END";
                    command.ExecuteNonQuery();
                }
            }

            context.Database.Migrate();
            logger.LogInformation("BANCO DE DADOS PRONTO");
            break;
        }
        catch (Exception ex)
        {
            logger.LogWarning($"Banco ainda não respondeu({ex.Message})");
            Thread.Sleep(1000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();