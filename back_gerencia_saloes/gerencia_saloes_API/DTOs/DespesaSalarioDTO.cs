namespace gerencia_saloes_API.DTOs
{
    public class DespesaSalarioDTO
    {
        public int IdDespesa { get; set; }
        public int IdFuncionario { get; set; }
        public string NomeFuncionario { get; set; }
        public DateTime DataAdmissao { get; set; }
        public decimal Valor { get; set; }
    }
}