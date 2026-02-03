using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.Models;

namespace gerencia_saloes_API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class FechamentoController : ControllerBase
    {
        private readonly FechamentoService _service;

        public FechamentoController(FechamentoService service)
        {
            _service = service;
        }

        [HttpGet("diario")]
        public async Task<ActionResult<FechamentoDiario>> GetFechamentoDia()
        {
            try
            {
                var fechamento = await _service.CalcularFechamentoDoDia();
                return Ok(fechamento);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao calcular fechamento diário: {ex.Message}");
            }
        }

        [HttpGet("mensal")]
        public async Task<ActionResult<FechamentoMensal>> GetFechamentoMes()
        {
            try
            {
                var fechamento = await _service.CalcularFechamentoDoMes();
                return Ok(fechamento);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao calcular fechamento mensal: {ex.Message}");
            }
        }

        [HttpGet("anual")]
        public async Task<ActionResult<FechamentoAnual>> GetFechamentoAno()
        {
            try
            {
                var fechamento = await _service.CalcularFechamentoDoAno();
                return Ok(fechamento);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao calcular fechamento anual: {ex.Message}");
            }
        }
    }
}