using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.Models;

public class Usuario
{
    [Key]
    public int IdUsuario { get; set; }

    [StringLength(100)]
    public string? Nome { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Senha { get; set; }

    [Required]
    public string Perfil { get; set; }
    public string? TokenRecuperacao { get; set; }
    public DateTime? DataExpiracaoToken { get; set; }
}