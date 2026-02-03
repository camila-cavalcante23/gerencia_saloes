using Microsoft.EntityFrameworkCore;
using gerencia_saloes_API.Data;
using gerencia_saloes_API.Models;
using gerencia_saloes_API.DTOs;
using BCrypt.Net;
using System.Configuration;

namespace gerencia_saloes_API.Services
{
    public class UsuarioService
    {
        private readonly SalaoContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public UsuarioService(SalaoContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<Usuario> CadastrarUsuario(UsuarioCadastroDTO dto, string perfil)
        {
            var existe = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (existe)
            {
                throw new Exception("Este email já está cadastrado.");
            }

            string senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha, workFactor: 10);

            var novoUsuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = senhaHash,
                Perfil = perfil
            };

            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();

            return novoUsuario;
        }
        public async Task<Usuario?> FazerLogin(LoginDTO dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuario == null)
            {
                return null;
            }

            bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha);

            if (senhaValida)
            {
                return usuario;
            }
            else
            {
                return null;
            }
        }

        public async Task<List<Usuario>> ListarApenasFuncionarios()
        {
            return await _context.Usuarios
                .Where(u => u.Perfil == "Funcionario")
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Usuario?> AtualizarPerfil(int id, AtualizarPerfilDTO dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == id);

            if (usuario == null) return null;

            usuario.Nome = dto.Nome;
            usuario.Email = dto.Email;

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<string> GerarTokenRecuperacao(string email)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

            if (usuario == null)
                throw new Exception("Usuário não encontrado.");

            var token = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

            usuario.TokenRecuperacao = token;
            usuario.DataExpiracaoToken = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            var baseUrl = _configuration["ClientSettings:Url"];
            var link = $"{baseUrl}/recuperar-senha?token={token}";

            string assunto = "Recuperação de Senha - Meu Salão";
            string mensagem = $@"Olá, {usuario.Nome}!
            
            Clique no link para recuperar a senha: {link}
        
            Ele é válido por 30 minutos.
            Se não foi você que pediu, ignore este e-mail.";

            _emailService.EnviarEmail(usuario.Email, assunto, mensagem);

            return "E-mail enviado com sucesso!";
        }

        public async Task<bool> RedefinirSenha(RedefinirSenhaDTO dto)
        {
            if (dto.NovaSenha != dto.ConfirmarNovaSenha)
            {
                throw new Exception("As senhas não conferem.");
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.TokenRecuperacao == dto.Token);

            if (usuario == null)
                throw new Exception("Token inválido ou não encontrado.");

            if (usuario.DataExpiracaoToken < DateTime.UtcNow)
                throw new Exception("Este link expirou. Solicite uma nova recuperação.");

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

            usuario.TokenRecuperacao = null;
            usuario.DataExpiracaoToken = null;

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task AlterarSenhaLogado(int idUsuario, AlterarSenhaLogadoDTO dto)
        {
            if (dto.NovaSenha != dto.ConfirmarNovaSenha)
            {
                throw new Exception("A confirmação da senha não confere com a nova senha.");
            }

            var usuario = await _context.Usuarios.FindAsync(idUsuario);

            if (usuario == null) throw new Exception("Usuário não encontrado.");

            bool senhaCorreta = BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.Senha);

            if (!senhaCorreta)
            {
                throw new Exception("A senha atual informada está incorreta.");
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task ExcluirUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null) throw new Exception("Usuário não encontrado.");

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExcluirFuncionario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null) return false;

            if (usuario.Perfil != "Funcionario")
            {
                return false;
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}