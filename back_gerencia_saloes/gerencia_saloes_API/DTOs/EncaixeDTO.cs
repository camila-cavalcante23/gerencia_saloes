using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class EncaixeDTO
    {
        [Required]
        public int IdTipoServico { get; set; }

        [Range(1, 100)]
        public int Quantidade { get; set; } = 1;

        public string? Responsavel { get; set; }

        public decimal? ValorCobrado { get; set; }


        public string? ClienteNome { get; set; }
    public string? Observacoes { get; set; }
    public string? Horario { get; set; }
    public DateTime DataServico { get; set; }
    }
}