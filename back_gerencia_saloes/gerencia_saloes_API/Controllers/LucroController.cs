using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.Models;

namespace gerencia_saloes_API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class LucroController : ControllerBase
    {
        private readonly LucroService _service;

        public LucroController(LucroService service)
        {
            _service = service;
        }

        [HttpGet("diario")]
        public async Task<ActionResult<LucroDiario>> GetDiario()
        {
            var lucro = await _service.CalcularLucroDiario();
            return Ok(lucro);
        }

        [HttpGet("mensal")]
        public async Task<ActionResult<LucroMensal>> GetMensal()
        {
            var lucro = await _service.CalcularLucroMensal();
            return Ok(lucro);
        }

        [HttpGet("anual")]
        public async Task<ActionResult<LucroAnual>> GetAnual()
        {
            var lucro = await _service.CalcularLucroAnual();
            return Ok(lucro);
        }
    }
}