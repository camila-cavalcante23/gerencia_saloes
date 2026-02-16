# Sistema de Gestão Simplificada para Salões de Beleza

Este projeto é desenvolvido como parte da disciplina de **Projeto Integrador IV** da **Universidade Federal do Ceará (UFC)**. O objetivo é aplicar os conhecimentos de Sistemas de Informação em uma solução real que auxilie empreendedores locais a migrarem da gestão analógica (caderno) para o digital.

O sistema foca na **extrema simplicidade cognitiva** e abordagem **"Mobile First"**, garantindo que usuários sem conhecimento técnico avançado possam gerir seus negócios com eficiência.

---

## 🚀 Funcionalidades Principais

O sistema organiza o fluxo de trabalho através de perfis de **Administrador** e **Operador**:

* **Dashboard Inteligente:** Visualização imediata da agenda do dia com status de atendimentos.
* **Gestão de Atendimentos:**
    * Agendamentos e **Encaixes Rápidos** realizados em no máximo 3 cliques.
    * Registro de responsáveis (barbeiros/cabeleireiros) por cada serviço.
    * Controle de status (Concluído / Não Compareceu).
    * Navegação histórica e futura via calendário.
* **Módulo de Relatórios:**
    * Filtros inteligentes por período (data de início e fim).
    * Histórico detalhado com identificação de cliente, serviço, valor e responsável.
    * Cálculo automático do faturamento bruto do período selecionado.
* **Controle de Serviços:** Cadastro personalizado de tipos de serviço (Corte, Barba, Química) e valores parametrizáveis.
* **Módulo Financeiro (Admin):**
    * **Fechamento Diário:** Cálculo automático de faturamento bruto dos serviços concluídos no dia.
    * **Gestão de Custos:** Registro de despesas operacionais e processamento de salários base.
* **Painel de Lucratividade:** Dashboard financeiro com cálculo de Lucro Líquido (`Faturamento - Custos`).

---

## 🛠 Tecnologias Utilizadas

* **Frontend:** React.js (Interface Responsiva)
* **Backend:** .NET Core API (C#)
* **Banco de Dados:** SQL Server
* **Infraestrutura:** Containerização via **Docker**
* **Segurança:** Criptografia de senhas e autenticação via JWT

---


## 📋 Escopo e Limitações

Para manter o foco na simplicidade interna, as seguintes funções estão fora do escopo:
* Realização de pagamentos bancários (Pix/Cartão) ou emissão de notas fiscais.
* Interface de agendamento para o cliente final (uso estritamente interno).
* Controle físico de estoque de produtos.

---

## 🔒 Propriedade Intelectual e Uso

> **IMPORTANTE:** Este sistema e sua metodologia de gestão foram idealizados e desenvolvidos exclusivamente para fins acadêmicos e sociais pelos alunos da UFC. **É estritamente proibida a comercialização, reprodução ou venda desta ideia, marca ou código-fonte por terceiros sem a autorização expressa e formal dos autores.**


© 2026 - Projeto Integrador IV - SI/UFC
