# Sistema de Gestão Simplificada para Salões de Beleza

Um sistema web intuitivo e responsivo focado em auxiliar empreendedores de salões locais que atualmente gerenciam seus negócios com métodos analógicos (caderno e caneta). O foco é a **extrema simplicidade cognitiva** e a abordagem **"Mobile First"**, removendo barreiras tecnológicas para usuários sem conhecimento técnico avançado.

Este projeto é desenvolvido como parte da disciplina de Projeto Integrador IV da Universidade Federal do Ceará (UFC). O objetivo é aplicar os conhecimentos adquiridos em um sistema web que solucione um problema real da comunidade.

## Funcionalidades Principais

O sistema implementa segurança através de dois perfis distintos (**Administrador** e **Operador**) para organizar o fluxo de trabalho:

* **Dashboard (Tela Inicial):** Exibe a **Agenda do Dia** com carregamento rápido e os compromissos da data corrente.
* **Gestão de Atendimentos:**
    * Adicionar agendamentos ou **Encaixes Rápidos** (máximo de 3 cliques).
    * Marcar serviços como "Concluído" ou "Não Compareceu".
    * Navegação completa via calendário (mensal e anual).
* **Controle de Serviços:** Cadastro parametrizável de tipos de serviço (Ex: Corte, Barba, Química...) e seus valores.
* **Gestão Financeira (Exclusivo Admin):**
    * **Fechamento Diário:** Botão "Finalizar Dia" que calcula o faturamento bruto dos serviços concluídos.
    * **Gestão de Custos:** Registro de despesas operacionais (contas, materiais) e processamento automático de salários base.
    * **Relatórios:** Exportação de dados para PDF ou Planilha (XLS/CSV).
* **Painel de Lucro:**
    * Dashboard financeiro (com filtros de dia, mês e ano) que mostra:
    * `(+) Faturamento Bruto`
    * `(-) Custos Totais`
    * `(=) Lucro Líquido`

## Limitações do Escopo (O que o sistema NÃO faz)

Para garantir a simplicidade e o foco na gestão interna, as seguintes funcionalidades estão explicitamente **fora do escopo**:

* **Pagamentos:** O sistema não realiza transações bancárias (Pix/Cartão) nem emite notas fiscais.
* **App do Cliente:** Não possui interface para o cliente final agendar sozinho; o uso é estritamente interno.
* **Estoque Físico:** Controla apenas o valor monetário da compra (despesa), não a contagem física de itens (ex: quantos vidros de shampoo).
* **Folha de Pagamento:** Não realiza cálculos trabalhistas complexos (INSS/FGTS).

## Tecnologias e Requisitos

* **Arquitetura:** Web (Frontend e Backend separados) e Responsiva.
* **Entrega:** Containerização via **Docker**.
* **Segurança:** Senhas criptografadas .
* **Controle de Versão:** Git.
