using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gerencia_saloes_API.Models
{
    public class FechamentoDiario
    {
        [Key]
        public int Id { get; set; }

        public DateTime Data { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal { get; set; }
        public int QtdConcluidos { get; set; }
        public int QtdNaoCompareceram { get; set; }
        public int QtdPendentes { get; set; }

    }
}