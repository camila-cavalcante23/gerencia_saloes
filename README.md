# Sistema de Gerenciamento para Empreendedores Locais, com Foco em Salões
Um sistema web simples e intuitivo focado em auxiliar empreendedores locais (donos de salão) que atualmente usam métodos analógicos (cadernos) para gerenciamento. O foco é a extrema simplicidade de uso, visto que o usuário-alvo pode não possuir conhecimento técnico avançado.

Este projeto é desenvolvido como parte da disciplina de Projeto Integrador IV da Universidade Federal do Ceará. O objetivo é aplicar os conhecimentos adquiridos em um sistema web que solucione um problema real da comunidade

##  Funcionalidades Principais

O sistema é focado em um **único usuário (o Dono)** para simplificar o controle total do negócio:

* **Dashboard (Tela Inicial):** Exibe a **Agenda do Dia** com todos os serviços marcados.
* **Gestão de Atendimentos:**
    * Adicionar serviços (agendados ou "encaixes").
    * Marcar serviços como "Concluído" ou "Não Compareceu".
* **Controle de Serviços:** Cadastro prévio de tipos de serviço (Ex: Corte, Barba, Escova...) e seus valores.
* **Fechamento Diário:** Botão "Finalizar Dia" que calcula o **faturamento bruto** (soma dos serviços concluídos).
* **Gestão de Custos:**
    * Registro de despesas (produtos, aluguel, contas).
    * Cadastro de funcionários e seus salários (usado apenas para o cálculo de despesas).
* **Relatório de Lucro:**
    * Painel financeiro (com filtros de dia, mês e ano) que mostra:
    * `(+) Faturamento Total`
    * `(-) Custos Totais`
    * `(=) Lucro Líquido`

