using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class AtualizarStatusDTO
    {
        [Required]
        public string Status { get; set; }
    }
}