using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TiposServicoController : ControllerBase
    {
        private readonly TipoServicoService _service;

        public TiposServicoController(TipoServicoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> Listar()
        {
            return Ok(await _service.ListarTodos());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Cadastrar(TipoServicoDTO dto)
        {
            var novo = await _service.Cadastrar(dto);
            return Created("", novo);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> Atualizar(int id, TipoServicoDTO dto)
        {
            var sucesso = await _service.Atualizar(id, dto);

            if (!sucesso)
            {
                return NotFound("Tipo de serviço não encontrado.");
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Excluir(int id)
        {
            var sucesso = await _service.Excluir(id);
            if (!sucesso) return NotFound();
            return NoContent();
        }
    }
}