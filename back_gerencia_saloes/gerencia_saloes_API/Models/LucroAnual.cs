using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gerencia_saloes_API.Models
{
    public class LucroAnual
    {
        [Key]
        public int Id { get; set; }
        public int Ano { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorFaturamento { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDespesas { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorSalarios { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal LucroLiquido { get; set; }
    }
}