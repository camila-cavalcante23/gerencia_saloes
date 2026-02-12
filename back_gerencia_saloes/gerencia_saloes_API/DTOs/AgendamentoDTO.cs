using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class AgendamentoDTO
    {
        [Required]
        public string ClienteNome { get; set; }

        public string? Telefone { get; set; }

        [Required]
        public DateTime DataServico { get; set; }

        [Required]
        [RegularExpression(@"\d{2}:\d{2}", ErrorMessage = "Horário deve ser HH:mm")]
        public string Horario { get; set; }

        public string? Observacoes { get; set; }

        public string? Responsavel { get; set; }

        [Required]
        public int IdTipoServico { get; set; }

        public decimal ValorCobrado { get; set; }
    }
}