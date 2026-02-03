using Microsoft.AspNetCore.Mvc;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;
using gerencia_saloes_API.Services;
using Microsoft.AspNetCore.Authorization;

namespace gerencia_saloes_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServicosController : ControllerBase
    {
        private readonly ServicoService _service;

        public ServicosController(ServicoService service)
        {
            _service = service;
        }

        [HttpGet("hoje")]
        public async Task<ActionResult<IEnumerable<Servico>>> GetAgendaDoDia()
        {
            return await _service.ListarAgendaDeHoje();
        }

        [HttpGet("mensal")]
        public async Task<ActionResult<IEnumerable<Servico>>> ListarMensalAtual()
        {
            var hoje = DateTime.Now;

            var lista = await _service.ListarMensal(hoje.Month, hoje.Year);

            if (!lista.Any()) return NotFound("Nenhum serviço realizado neste mês.");

            return Ok(lista);
        }

        [HttpGet("anual")]
        public async Task<ActionResult<IEnumerable<Servico>>> ListarAnualAtual()
        {
            var anoAtual = DateTime.Now.Year;

            var lista = await _service.ListarAnual(anoAtual);

            if (!lista.Any()) return NotFound("Nenhum serviço realizado neste ano.");

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Servico>> GetServico(int id)
        {
            var servico = await _service.BuscarPorId(id);

            if (servico == null)
            {
                return NotFound();
            }

            return servico;
        }

        [HttpPost("agendar")]
        public async Task<ActionResult<Servico>> Agendar(AgendamentoDTO dto)
        {
            try
            {
                var servico = await _service.CriarAgendamento(dto);
                return CreatedAtAction("GetServico", new { id = servico.IdServico }, servico);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("encaixe")]
        public async Task<ActionResult<List<Servico>>> Encaixe(EncaixeDTO dto)
        {
            try
            {
                var listaNovosServicos = await _service.CriarEncaixe(dto);
                
                return Ok(listaNovosServicos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarStatus(int id, AtualizarStatusDTO dto)
        {
            try
            {
                await _service.AtualizarStatus(id, dto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServico(int id)
        {
            var sucesso = await _service.Excluir(id);

            if (!sucesso)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}