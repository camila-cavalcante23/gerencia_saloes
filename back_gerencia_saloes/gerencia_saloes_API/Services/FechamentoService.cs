using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.Data;

namespace gerencia_saloes_API.Services
{
    public class FechamentoService
    {
        private readonly SalaoContext _context;

        public FechamentoService(SalaoContext context)
        {
            _context = context;
        }

        public async Task<FechamentoDiario> CalcularFechamentoDoDia()
        {
            var hoje = DateTime.Today;

            var servicosDoDia = await _context.Servicos
                .Where(s => s.DataServico.Date == hoje)
                .ToListAsync();

            var qtdConcluidos = servicosDoDia.Count(s => s.StatusServico == "Concluido");
            var qtdNaoCompareceram = servicosDoDia.Count(s => s.StatusServico == "Não compareceu");
            var qtdPendentes = servicosDoDia.Count(s => s.StatusServico == "Agendado");

            var valorTotal = servicosDoDia
                .Where(s => s.StatusServico == "Concluido")
                .Sum(s => s.ValorCobrado);

            var fechamento = await _context.FechamentosDiarios
                .FirstOrDefaultAsync(f => f.Data == hoje);

            if (fechamento != null)
            {
                fechamento.ValorTotal = valorTotal;
                fechamento.QtdConcluidos = qtdConcluidos;
                fechamento.QtdNaoCompareceram = qtdNaoCompareceram;
                fechamento.QtdPendentes = qtdPendentes;
            }
            else
            {
                fechamento = new FechamentoDiario
                {
                    Data = hoje,
                    ValorTotal = valorTotal,
                    QtdConcluidos = qtdConcluidos,
                    QtdNaoCompareceram = qtdNaoCompareceram,
                    QtdPendentes = qtdPendentes
                };
                _context.FechamentosDiarios.Add(fechamento);
            }

            await _context.SaveChangesAsync();
            return fechamento;
        }

        public async Task<FechamentoMensal> CalcularFechamentoDoMes()
        {
            var hoje = DateTime.Today;
            var mesAtual = hoje.Month;
            var anoAtual = hoje.Year;

            var servicosDoMes = await _context.Servicos
                .Where(s => s.DataServico.Month == mesAtual && s.DataServico.Year == anoAtual)
                .ToListAsync();

            var qtdConcluidos = servicosDoMes.Count(s => s.StatusServico == "Concluido");
            var qtdNaoCompareceram = servicosDoMes.Count(s => s.StatusServico == "Não compareceu");
            var qtdPendentes = servicosDoMes.Count(s => s.StatusServico == "Agendado");

            var valorTotal = servicosDoMes
                .Where(s => s.StatusServico == "Concluido")
                .Sum(s => s.ValorCobrado);

            var fechamento = await _context.FechamentosMensais
                .FirstOrDefaultAsync(f => f.Mes == mesAtual && f.Ano == anoAtual);

            if (fechamento != null)
            {
                fechamento.ValorTotal = valorTotal;
                fechamento.QtdConcluidos = qtdConcluidos;
                fechamento.QtdNaoCompareceram = qtdNaoCompareceram;
                fechamento.QtdPendentes = qtdPendentes;
            }
            else
            {
                fechamento = new FechamentoMensal
                {
                    Mes = mesAtual,
                    Ano = anoAtual,
                    ValorTotal = valorTotal,
                    QtdConcluidos = qtdConcluidos,
                    QtdNaoCompareceram = qtdNaoCompareceram,
                    QtdPendentes = qtdPendentes
                };
                _context.FechamentosMensais.Add(fechamento);
            }

            await _context.SaveChangesAsync();
            return fechamento;
        }

        public async Task<FechamentoAnual> CalcularFechamentoDoAno()
        {
            var anoAtual = DateTime.Today.Year;

            var servicosDoAno = await _context.Servicos
                .Where(s => s.DataServico.Year == anoAtual)
                .ToListAsync();

            var qtdConcluidos = servicosDoAno.Count(s => s.StatusServico == "Concluido");
            var qtdNaoCompareceram = servicosDoAno.Count(s => s.StatusServico == "Não compareceu");
            var qtdPendentes = servicosDoAno.Count(s => s.StatusServico == "Agendado");

            var valorTotal = servicosDoAno
                .Where(s => s.StatusServico == "Concluido")
                .Sum(s => s.ValorCobrado);

            var fechamento = await _context.FechamentosAnuais
                .FirstOrDefaultAsync(f => f.Ano == anoAtual);

            if (fechamento != null)
            {
                fechamento.ValorTotal = valorTotal;
                fechamento.QtdConcluidos = qtdConcluidos;
                fechamento.QtdNaoCompareceram = qtdNaoCompareceram;
                fechamento.QtdPendentes = qtdPendentes;
            }
            else
            {
                fechamento = new FechamentoAnual
                {
                    Ano = anoAtual,
                    ValorTotal = valorTotal,
                    QtdConcluidos = qtdConcluidos,
                    QtdNaoCompareceram = qtdNaoCompareceram,
                    QtdPendentes = qtdPendentes
                };
                _context.FechamentosAnuais.Add(fechamento);
            }

            await _context.SaveChangesAsync();
            return fechamento;
        }
    }
}