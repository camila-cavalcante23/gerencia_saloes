using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class TipoServicoDTO
    {
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal ValorPadrao { get; set; }

        public int? DuracaoMinutos { get; set; }
    }
}