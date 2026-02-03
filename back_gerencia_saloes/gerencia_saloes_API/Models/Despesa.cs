using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gerencia_saloes_API.Models
{
    public class Despesa
    {
        [Key]
        public int IdDespesa { get; set; }

        [Required]
        [StringLength(100)]
        public string Descricao { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataDespesa { get; set; }

        public int? IdFuncionario { get; set; }

        [ForeignKey("IdFuncionario")]
        public Funcionario? Funcionario { get; set; }
    }
}