using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class DespesaGeralDTO
    {
        [Required]
        public string Descricao { get; set; }

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataDespesa { get; set; }
    }
}