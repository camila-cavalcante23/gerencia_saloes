using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class AlterarSenhaLogadoDTO
    {
        [Required]
        public string SenhaAtual { get; set; }

        [Required]
        public string NovaSenha { get; set; }

        [Required]
        [Compare("NovaSenha", ErrorMessage = "As senhas não conferem.")]
        public string ConfirmarNovaSenha { get; set; }
    }
}