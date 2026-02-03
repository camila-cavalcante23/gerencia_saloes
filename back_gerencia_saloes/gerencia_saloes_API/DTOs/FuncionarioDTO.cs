using System.ComponentModel.DataAnnotations;

namespace gerencia_saloes_API.DTOs
{
    public class FuncionarioDTO
    {
        [Required]
        public string Nome { get; set; }

        public string Telefone { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Salario { get; set; }

        [Required]
        public DateTime DataAdmissao { get; set; }
    }
}