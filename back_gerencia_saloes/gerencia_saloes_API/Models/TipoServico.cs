namespace gerencia_saloes_API.Models;

public class TipoServico
{
    [Key]
    public int IdTipoServico { get; set; }

    [Required]
    public string NomeServico { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorPadrao { get; set; }

    public int? DuracaoMinutos { get; set; }
}