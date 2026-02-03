using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.Data;

namespace gerencia_saloes_API.Services
{
    public class LucroService
    {
        private readonly SalaoContext _context;

        public LucroService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<LucroDiario> CalcularLucroDiario()
        {
            var hoje = DateTime.Today;

            var faturamento = await _context.Servicos
                .Where(s => s.DataServico.Date == hoje && s.StatusServico == "Concluido")
                .SumAsync(s => s.ValorCobrado);

            var despesas = await _context.Despesas
                .Where(d => d.DataDespesa.Date == hoje && d.IdFuncionario == null)
                .SumAsync(d => d.Valor);

            decimal salarios = 0;

            var lucroLiquido = faturamento - despesas;

            var registro = await _context.LucrosDiarios.FirstOrDefaultAsync(l => l.Data == hoje);

            if (registro != null)
            {
                registro.ValorFaturamento = faturamento;
                registro.ValorDespesas = despesas;
                registro.ValorSalarios = salarios;
                registro.LucroLiquido = lucroLiquido;
            }
            else
            {
                registro = new LucroDiario
                {
                    Data = hoje,
                    ValorFaturamento = faturamento,
                    ValorDespesas = despesas,
                    ValorSalarios = salarios,
                    LucroLiquido = lucroLiquido
                };
                _context.LucrosDiarios.Add(registro);
            }

            await _context.SaveChangesAsync();
            return registro;
        }

        public async Task<LucroMensal> CalcularLucroMensal()
        {
            var hoje = DateTime.Today;
            var mes = hoje.Month;
            var ano = hoje.Year;

            var faturamento = await _context.Servicos
                .Where(s => s.DataServico.Month == mes && s.DataServico.Year == ano && s.StatusServico == "Concluido")
                .SumAsync(s => s.ValorCobrado);

            var saidasDoMes = await _context.Despesas
                .Where(d => d.DataDespesa.Month == mes && d.DataDespesa.Year == ano)
                .ToListAsync();

            var salarios = saidasDoMes.Where(d => d.IdFuncionario != null).Sum(d => d.Valor);
            var despesas = saidasDoMes.Where(d => d.IdFuncionario == null).Sum(d => d.Valor);

            var lucroLiquido = faturamento - (salarios + despesas);

            var registro = await _context.LucrosMensais.FirstOrDefaultAsync(l => l.Mes == mes && l.Ano == ano);

            if (registro != null)
            {
                registro.ValorFaturamento = faturamento;
                registro.ValorDespesas = despesas;
                registro.ValorSalarios = salarios;
                registro.LucroLiquido = lucroLiquido;
            }
            else
            {
                registro = new LucroMensal
                {
                    Mes = mes,
                    Ano = ano,
                    ValorFaturamento = faturamento,
                    ValorDespesas = despesas,
                    ValorSalarios = salarios,
                    LucroLiquido = lucroLiquido
                };
                _context.LucrosMensais.Add(registro);
            }

            await _context.SaveChangesAsync();
            return registro;
        }

        public async Task<LucroAnual> CalcularLucroAnual()
        {
            var ano = DateTime.Today.Year;

            var faturamento = await _context.Servicos
                .Where(s => s.DataServico.Year == ano && s.StatusServico == "Concluido")
                .SumAsync(s => s.ValorCobrado);

            var saidasDoAno = await _context.Despesas
                .Where(d => d.DataDespesa.Year == ano)
                .ToListAsync();

            var salarios = saidasDoAno.Where(d => d.IdFuncionario != null).Sum(d => d.Valor);
            var despesas = saidasDoAno.Where(d => d.IdFuncionario == null).Sum(d => d.Valor);

            var lucroLiquido = faturamento - (salarios + despesas);

            var registro = await _context.LucrosAnuais.FirstOrDefaultAsync(l => l.Ano == ano);

            if (registro != null)
            {
                registro.ValorFaturamento = faturamento;
                registro.ValorDespesas = despesas;
                registro.ValorSalarios = salarios;
                registro.LucroLiquido = lucroLiquido;
            }
            else
            {
                registro = new LucroAnual
                {
                    Ano = ano,
                    ValorFaturamento = faturamento,
                    ValorDespesas = despesas,
                    ValorSalarios = salarios,
                    LucroLiquido = lucroLiquido
                };
                _context.LucrosAnuais.Add(registro);
            }

            await _context.SaveChangesAsync();
            return registro;
        }
    }
}