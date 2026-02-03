using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gerencia_saloes_API.Models
{
    public class FechamentoMensal
    {
        [Key]
        public int Id { get; set; }

        public int Mes { get; set; }
        public int Ano { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal { get; set; }
        public int QtdConcluidos { get; set; }
        public int QtdNaoCompareceram { get; set; }
        public int QtdPendentes { get; set; }
    }
}