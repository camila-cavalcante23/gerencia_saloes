using Microsoft.AspNetCore.Mvc;
using gerencia_saloes_API.DTOs;
using gerencia_saloes_API.Services;
using gerencia_saloes_API.Models;
using Microsoft.AspNetCore.Authorization;

namespace gerencia_saloes_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _service;
        private readonly TokenService _tokenService;

        public UsuarioController(UsuarioService service, TokenService tokenService)
        {
            _service = service;
            _tokenService = tokenService;
        }

        [HttpPost("cadastro-admin")]
        public async Task<ActionResult> RegistrarAdmin(UsuarioCadastroDTO dto)
        {
            try
            {
                var usuario = await _service.CadastrarUsuario(dto, "Admin");

                return CreatedAtAction(nameof(Listar), new { id = usuario.IdUsuario }, new
                {
                    usuario.IdUsuario,
                    usuario.Email,
                    usuario.Perfil
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("cadastro-funcionario")]
        public async Task<ActionResult> CriarFuncionario(UsuarioCadastroDTO dto)
        {
            try
            {
                var usuario = await _service.CadastrarUsuario(dto, "Funcionario");

                return CreatedAtAction(nameof(Listar), new { id = usuario.IdUsuario }, new
                {
                    usuario.IdUsuario,
                    usuario.Nome,
                    usuario.Email,
                    usuario.Perfil
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDTO dto)
        {
            try
            {
                var usuario = await _service.FazerLogin(dto);

                if (usuario == null)
                {
                    return Unauthorized("E-mail ou senha inválidos.");
                }

                var token = _tokenService.GerarToken(usuario);

                return Ok(new
                {
                    id = usuario.IdUsuario,
                    usuario = usuario.Nome ?? string.Empty,
                    email = usuario.Email,
                    perfil = usuario.Perfil,
                    token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> AtualizarPerfil(int id, AtualizarPerfilDTO dto)
        {
            try
            {

                var usuarioAtualizado = await _service.AtualizarPerfil(id, dto);

                if (usuarioAtualizado == null)
                    return NotFound("Usuário não encontrado");

                return Ok(new
                {
                    mensagem = "Perfil atualizado",
                    nome = usuarioAtualizado.Nome,
                    email = usuarioAtualizado.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao atualizar: {ex.Message}");
            }
        }

        [HttpPost("esqueceu-senha")]
        public async Task<IActionResult> EsqueceuSenha([FromBody] EsqueceuSenhaDTO dto)
        {
            try
            {
                var token = await _service.GerarTokenRecuperacao(dto.Email);

                return Ok(new
                {
                    mensagem = "Token gerado com sucesso.",
                    token_simulado = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("redefinir-senha")]
        public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaDTO dto)
        {
            try
            {
                await _service.RedefinirSenha(dto);
                return Ok(new { mensagem = "Senha alterada com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}/alterar-senha")]
        public async Task<IActionResult> AlterarSenhaLogado(int id, [FromBody] AlterarSenhaLogadoDTO dto)
        {
            try
            {
                var idToken = int.Parse(User.FindFirst("id")?.Value ?? "0");
                if (id != idToken) return Forbid("Você não pode alterar a senha de outro usuário.");

                await _service.AlterarSenhaLogado(id, dto);

                return Ok(new { mensagem = "Senha alterada com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> Listar()
        {
            return await _service.ListarApenasFuncionarios();
        }

        [Authorize]
        [HttpDelete("excluir-conta")]
        public async Task<IActionResult> ExcluirMinhaConta()
        {
            try
            {
                var idClaim = User.FindFirst("id")?.Value;

                if (string.IsNullOrEmpty(idClaim))
                    return Unauthorized("Token inválido.");

                var idUsuario = int.Parse(idClaim);

                await _service.ExcluirUsuario(idUsuario);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> ExcluirFuncionario(int id)
        {
            try
            {
                var sucesso = await _service.ExcluirFuncionario(id);

                if (!sucesso)
                {
                    return NotFound("Funcionário não encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Não foi possível excluir: {ex.Message}");
            }
        }
    }
}