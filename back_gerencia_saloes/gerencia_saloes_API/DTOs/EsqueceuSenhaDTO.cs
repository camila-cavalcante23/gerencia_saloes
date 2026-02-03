using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class EsqueceuSenhaDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}