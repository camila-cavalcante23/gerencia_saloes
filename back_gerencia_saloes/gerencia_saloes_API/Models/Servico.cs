namespace gerencia_saloes_API.Models
{
    public class Servico
    {
        [Key]
        public int IdServico { get; set; }

        [Required]
        [StringLength(100)]
        public string ClienteNome { get; set; }

        [StringLength(20)]
        public string? Telefone { get; set; }

        public DateTime DataServico { get; set; }
        public TimeSpan Horario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorCobrado { get; set; }

        public string StatusServico { get; set; }

        public int Quantidade { get; set; } = 1;

        [StringLength(100)]
        public string? Responsavel { get; set; }

        public string? Observacoes { get; set; }

        public int IdTipoServico { get; set; }

        [ForeignKey("IdTipoServico")]
        public TipoServico? TipoServico { get; set; }
    }
}