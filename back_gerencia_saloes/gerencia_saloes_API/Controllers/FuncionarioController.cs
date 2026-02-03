using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.DTOs;

namespace gerencia_saloes_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class FuncionarioController : ControllerBase
    {
        private readonly FuncionarioService _service;

        public FuncionarioController(FuncionarioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> Listar()
        {
            return Ok(await _service.ListarTodos());
        }

        [HttpPost]
        public async Task<ActionResult> Cadastrar(FuncionarioDTO dto)
        {
            var novo = await _service.Cadastrar(dto);
            return CreatedAtAction(nameof(Listar), new { id = novo.IdFuncionario }, novo);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Excluir(int id)
        {
            var sucesso = await _service.Excluir(id);
            if (!sucesso) return NotFound("Funcionário não encontrado.");

            return NoContent();
        }
    }
}