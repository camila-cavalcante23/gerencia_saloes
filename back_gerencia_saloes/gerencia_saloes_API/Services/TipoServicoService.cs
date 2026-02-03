using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Services
{
    public class TipoServicoService
    {
        private readonly SalaoContext _context;

        public TipoServicoService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<List<TipoServico>> ListarTodos()
        {
            return await _context.TiposServicos
                .AsNoTracking()
                .OrderBy(t => t.NomeServico)
                .ToListAsync();
        }

        public async Task<TipoServico> Cadastrar(TipoServicoDTO dto)
        {
            var novoTipo = new TipoServico
            {
                NomeServico = dto.Nome,
                ValorPadrao = dto.ValorPadrao,
                DuracaoMinutos = dto.DuracaoMinutos
            };

            _context.TiposServicos.Add(novoTipo);
            await _context.SaveChangesAsync();
            return novoTipo;
        }

        public async Task<bool> Atualizar(int id, TipoServicoDTO dto)
        {
            var tipo = await _context.TiposServicos.FindAsync(id);

            if (tipo == null) return false;

            tipo.NomeServico = dto.Nome;
            tipo.ValorPadrao = dto.ValorPadrao;
            tipo.DuracaoMinutos = dto.DuracaoMinutos;

            _context.TiposServicos.Update(tipo);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Excluir(int id)
        {
            var tipo = await _context.TiposServicos.FindAsync(id);
            if (tipo == null) return false;

            _context.TiposServicos.Remove(tipo);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}