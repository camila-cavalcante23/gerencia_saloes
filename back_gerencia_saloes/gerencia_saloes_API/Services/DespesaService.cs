using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Services
{
    public class DespesaService
    {
        private readonly SalaoContext _context;

        public DespesaService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<List<Despesa>> ListarTodas()
        {
            return await _context.Despesas
                .Include(d => d.Funcionario)
                .AsNoTracking()
                .OrderByDescending(d => d.DataDespesa)
                .ToListAsync();
        }

        public async Task<List<DespesaSalarioDTO>> ListarApenasSalarios()
        {
            return await _context.Despesas
                .AsNoTracking()
                .Where(d => d.IdFuncionario != null)
                .Include(d => d.Funcionario)
                .Select(d => new DespesaSalarioDTO
                {
                    IdDespesa = d.IdDespesa,
                    IdFuncionario = d.IdFuncionario.Value,
                    NomeFuncionario = d.Funcionario.Nome,
                    DataAdmissao = d.Funcionario.DataAdmissao,
                    Valor = d.Valor
                })
                .ToListAsync();
        }

        public async Task<List<Despesa>> ListarApenasGerais()
        {
            return await _context.Despesas
                .AsNoTracking()
                .Where(d => d.IdFuncionario == null)
                .OrderByDescending(d => d.DataDespesa)
                .ToListAsync();
        }

        public async Task<Despesa> CadastrarGeral(DespesaGeralDTO dto)
        {
            var despesa = new Despesa
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                DataDespesa = dto.DataDespesa,
                IdFuncionario = null
            };

            _context.Despesas.Add(despesa);
            await _context.SaveChangesAsync();
            return despesa;
        }

        private IQueryable<Despesa> AplicarFiltroData(IQueryable<Despesa> query, DateTime? data, int? mes, int? ano)
        {
            if (data.HasValue)
            {
                return query.Where(d => d.DataDespesa.Date == data.Value.Date);
            }
            else if (mes.HasValue && ano.HasValue)
            {
                return query.Where(d => d.DataDespesa.Month == mes && d.DataDespesa.Year == ano);
            }
            else if (ano.HasValue)
            {
                return query.Where(d => d.DataDespesa.Year == ano);
            }

            return query;
        }

        public async Task<DashboardCustosDTO> ObterTotais(DateTime? data, int? mes, int? ano)
        {
            var query = _context.Despesas.AsNoTracking();

            query = AplicarFiltroData(query, data, mes, ano);

            var totalGerais = await query
                .Where(d => d.IdFuncionario == null)
                .SumAsync(d => d.Valor);

            var totalSalarios = await query
                .Where(d => d.IdFuncionario != null)
                .SumAsync(d => d.Valor);

            return new DashboardCustosDTO
            {
                TotalDespesasGerais = totalGerais,
                TotalSalarios = totalSalarios,
                TotalGeral = totalGerais + totalSalarios
            };
        }

        public async Task<List<Despesa>> ListarComFiltro(string tipoFiltro, DateTime? data, int? mes, int? ano)
        {
            var query = _context.Despesas
                .Include(d => d.Funcionario)
                .AsNoTracking();

            query = AplicarFiltroData(query, data, mes, ano);

            if (tipoFiltro == "salarios")
            {
                query = query.Where(d => d.IdFuncionario != null);
            }
            else if (tipoFiltro == "gerais")
            {
                query = query.Where(d => d.IdFuncionario == null);
            }

            return await query
                .OrderByDescending(d => d.DataDespesa)
                .ToListAsync();
        }

        public async Task<bool> Excluir(int id)
        {
            var despesa = await _context.Despesas.FindAsync(id);
            if (despesa == null) return false;
            _context.Despesas.Remove(despesa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}