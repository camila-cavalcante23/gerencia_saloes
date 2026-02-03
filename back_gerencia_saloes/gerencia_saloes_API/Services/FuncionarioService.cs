using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Services
{
    public class FuncionarioService
    {
        private readonly SalaoContext _context;

        public FuncionarioService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<List<Funcionario>> ListarTodos()
        {
            return await _context.Funcionarios.AsNoTracking().ToListAsync();
        }

        public async Task<Funcionario> Cadastrar(FuncionarioDTO dto)
        {
            var func = new Funcionario
            {
                Nome = dto.Nome,
                Telefone = dto.Telefone,
                Salario = dto.Salario,
                DataAdmissao = dto.DataAdmissao
            };

            _context.Funcionarios.Add(func);

            await _context.SaveChangesAsync();

            var despesaSalario = new Despesa
            {
                Descricao = $"Salário - {func.Nome}",
                Valor = func.Salario,
                DataDespesa = func.DataAdmissao,
                IdFuncionario = func.IdFuncionario
            };

            _context.Despesas.Add(despesaSalario);

            await _context.SaveChangesAsync();

            return func;
        }

        public async Task<bool> Excluir(int id)
        {
            var func = await _context.Funcionarios.FindAsync(id);
            if (func == null) return false;

            _context.Funcionarios.Remove(func);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}