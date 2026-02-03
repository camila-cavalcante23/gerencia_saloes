using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class UsuarioCadastroDTO
    {
        public string? Nome { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Senha { get; set; }
    }
}