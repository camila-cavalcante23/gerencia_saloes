using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace gerencia_saloes_API.Data;

public class SalaoContext : DbContext
{
    public SalaoContext(DbContextOptions<SalaoContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<TipoServico> TiposServicos { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<FechamentoDiario> FechamentosDiarios { get; set; }
    public DbSet<FechamentoMensal> FechamentosMensais { get; set; }
    public DbSet<FechamentoAnual> FechamentosAnuais { get; set; }
    public DbSet<Funcionario> Funcionarios { get; set; }
    public DbSet<Despesa> Despesas { get; set; }
    public DbSet<LucroDiario> LucrosDiarios { get; set; }
    public DbSet<LucroMensal> LucrosMensais { get; set; }
    public DbSet<LucroAnual> LucrosAnuais { get; set; }
}