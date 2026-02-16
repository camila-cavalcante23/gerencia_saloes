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
                   
            ClienteNome = dto.ClienteNome ?? "Cliente Avulso", 
            
           
            Observacoes = dto.Observacoes ?? "Encaixe Rápido", 
            
           
            Horario = !string.IsNullOrEmpty(dto.Horario) 
                      ? TimeSpan.Parse(dto.Horario) 
                      : DateTime.Now.TimeOfDay,
            
            DataServico = dto.DataServico.Date,
            Telefone = null,
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

       public async Task<bool> Atualizar(int id, AgendamentoDTO dto)
{
    var servico = await _context.Servicos.FindAsync(id);

    if (servico == null) return false;


    if (!string.IsNullOrEmpty(dto.ClienteNome))
    {
        servico.ClienteNome = dto.ClienteNome;
        servico.Telefone = dto.Telefone;
        servico.Observacoes = dto.Observacoes;
        servico.DataServico = dto.DataServico;
        servico.Horario = TimeSpan.Parse(dto.Horario);
        servico.IdTipoServico = dto.IdTipoServico;
        servico.ValorCobrado = dto.ValorCobrado;
        servico.Responsavel = dto.Responsavel;
    }
    


    await _context.SaveChangesAsync();
    return true;
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