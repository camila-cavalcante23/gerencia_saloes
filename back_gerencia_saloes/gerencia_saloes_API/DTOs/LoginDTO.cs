using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Senha { get; set; }
    }
}