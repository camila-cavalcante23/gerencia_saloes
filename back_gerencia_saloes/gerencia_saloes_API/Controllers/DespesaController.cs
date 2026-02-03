using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class DespesaController : ControllerBase
    {
        private readonly DespesaService _service;

        public DespesaController(DespesaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> ListarTudo()
        {
            return Ok(await _service.ListarTodas());
        }

        [HttpGet("salarios")]
        public async Task<ActionResult<List<DespesaSalarioDTO>>> ListarSalarios()
        {
            var lista = await _service.ListarApenasSalarios();
            return Ok(lista);
        }

        [HttpGet("gerais")]
        public async Task<ActionResult> ListarGerais()
        {
            return Ok(await _service.ListarApenasGerais());
        }

        [HttpGet("calcular-totais")]
        public async Task<ActionResult<DashboardCustosDTO>> GetTotais(
            [FromQuery] DateTime? data,
            [FromQuery] int? mes,
            [FromQuery] int? ano)
        {
            var totais = await _service.ObterTotais(data, mes, ano);
            return Ok(totais);
        }

        [HttpGet("listar-filtro")]
        public async Task<ActionResult<List<Despesa>>> GetListagem(
            [FromQuery] string tipo,
            [FromQuery] DateTime? data,
            [FromQuery] int? mes,
            [FromQuery] int? ano)
        {
            var lista = await _service.ListarComFiltro(tipo, data, mes, ano);
            return Ok(lista);
        }

        [HttpPost]
        public async Task<ActionResult> Cadastrar([FromBody] DespesaGeralDTO dto)
        {
            try
            {
                var nova = await _service.CadastrarGeral(dto);

                return CreatedAtAction(nameof(ListarTudo), new { id = nova.IdDespesa }, nova);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Excluir(int id)
        {
            var sucesso = await _service.Excluir(id);
            if (!sucesso) return NotFound("Despesa não encontrada.");
            return NoContent();
        }
    }
}