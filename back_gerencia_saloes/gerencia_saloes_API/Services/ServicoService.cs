using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Data;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Services
{
    public class ServicoService
    {
        private readonly SalaoContext _context;

        public ServicoService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<Servico?> BuscarPorId(int id)
        {
            return await _context.Servicos
                .Include(s => s.TipoServico)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.IdServico == id);
        }

        public async Task<List<Servico>> ListarAgendaDeHoje()
        {
            var hoje = DateTime.Today;
            return await _context.Servicos
                .Where(s => s.DataServico.Date == hoje)
                .Include(s => s.TipoServico)
                .ToListAsync();
        }

        public async Task<List<Servico>> ListarMensal(int mes, int ano)
        {
            return await _context.Servicos
                .Where(s => s.DataServico.Month == mes && s.DataServico.Year == ano)
                .Include(s => s.TipoServico)
                .OrderBy(s => s.DataServico)
                .ToListAsync();
        }

        public async Task<List<Servico>> ListarAnual(int ano)
        {
            return await _context.Servicos
                .Where(s => s.DataServico.Year == ano)
                .Include(s => s.TipoServico)
                .OrderBy(s => s.DataServico)
                .ToListAsync();
        }

        public async Task<Servico> CriarAgendamento(AgendamentoDTO dto)
        {
            var tipo = await _context.TiposServicos.FindAsync(dto.IdTipoServico);
            if (tipo == null) throw new Exception("Tipo de serviço inválido");

            var servico = new Servico
            {
                ClienteNome = dto.ClienteNome,
                Telefone = dto.Telefone,
                Observacoes = dto.Observacoes,

                DataServico = dto.DataServico,
                Horario = TimeSpan.Parse(dto.Horario),

                StatusServico = "Agendado",
                Quantidade = 1,
               Responsavel = dto.Responsavel,

                IdTipoServico = dto.IdTipoServico,
                ValorCobrado = dto.ValorCobrado > 0 ? dto.ValorCobrado : tipo.ValorPadrao
            };

            _context.Servicos.Add(servico);
            await _context.SaveChangesAsync();
            return servico;
        }

        public async Task<List<Servico>> CriarEncaixe(EncaixeDTO dto)
        {
            var tipo = await _context.TiposServicos.FindAsync(dto.IdTipoServico);
            if (tipo == null) throw new Exception("Tipo de serviço inválido");

            var agora = DateTime.Now;
            var listaServicosGerados = new List<Servico>();

            decimal valorUnitario = dto.ValorCobrado ?? tipo.ValorPadrao;

            for (int i = 0; i < dto.Quantidade; i++)
            {
                var servico = new Servico
                {
                    ClienteNome = "Cliente Avulso",
                    Telefone = null,
                    Observacoes = "Encaixe Rápido",
                    DataServico = agora.Date,
                    Horario = agora.TimeOfDay,
                    StatusServico = "Concluido",
                    Quantidade = 1,
                    Responsavel = dto.Responsavel,
                    IdTipoServico = dto.IdTipoServico,

                    ValorCobrado = valorUnitario
                };

                listaServicosGerados.Add(servico);
            }

            _context.Servicos.AddRange(listaServicosGerados);
            await _context.SaveChangesAsync();

            return listaServicosGerados;
        }

        public async Task AtualizarStatus(int id, string novoStatus)
        {
            var servico = await _context.Servicos.FindAsync(id);

            if (servico == null)
                throw new Exception("Serviço não encontrado.");

            if (servico.StatusServico != "Agendado")
            {
                throw new Exception("Apenas serviços agendados podem ter o status alterado.");
            }

            servico.StatusServico = novoStatus;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> Excluir(int id)
        {
            var servico = await _context.Servicos.FindAsync(id);
            if (servico == null) return false;

            _context.Servicos.Remove(servico);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}