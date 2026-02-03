using MailKit.Net.Smtp;
using MimeKit;

namespace gerencia_saloes_API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void EnviarEmail(string destinatario, string assunto, string mensagemTexto)
        {
            var email = new MimeMessage();

            var remetente = _configuration["EmailSettings:UserName"];
            email.From.Add(MailboxAddress.Parse(remetente));
            email.To.Add(MailboxAddress.Parse(destinatario));

            email.Subject = assunto;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Text)
            {
                Text = mensagemTexto
            };

            using (var smtp = new SmtpClient())
            {
                var host = _configuration["EmailSettings:Host"];
                var port = int.Parse(_configuration["EmailSettings:Port"]);
                var password = _configuration["EmailSettings:Password"];

                try
                {
                    smtp.Connect(host, port, MailKit.Security.SecureSocketOptions.StartTls);
                    smtp.Authenticate(remetente, password);
                    smtp.Send(email);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao enviar email: {ex.Message}");
                    throw;
                }
                finally
                {
                    smtp.Disconnect(true);
                }
            }
        }
    }
}