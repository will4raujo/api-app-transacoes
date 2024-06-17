Projeto NestJS com PostgreSQL e Docker
Este projeto utiliza Node.js com o framework NestJS, PostgreSQL como banco de dados e Docker para simplificar a configuração e execução do ambiente.

Pré-requisitos
Antes de começar, certifique-se de ter os seguintes softwares instalados em sua máquina:

Docker
Node.js (recomenda-se a versão LTS)
Docker Compose
Instruções para configuração

1. Clonar o repositório
Faça uma cópia do repositório remoto em seu computador:
  git clone <URL-do-repositório>
  cd <nome-do-repositório> 

2. Instalar dependências
Instale as dependências do Node.js utilizando o comando:
  npm install

3. Configurar o Docker

Crie e inicie os containers Docker utilizando o comando:
  docker-compose up -d

Certifique-se de que os containers foram iniciados corretamente:
  docker ps

4. Verificar portas
Verifique se as portas 5433 (PostgreSQL) e 3333 (NestJS) estão livres:
  netstat -an | find "5433"
  netstat -an | find "3333"

5. Iniciar a aplicação
Inicie a aplicação em modo de desenvolvimento:
  npm run start:dev


Observações
Certifique-se de que as variáveis de ambiente no arquivo .env estão configuradas corretamente, especialmente a DATABASE_URL para a conexão com o banco de dados PostgreSQL.
Se houver conflitos de porta, ajuste as portas no arquivo docker-compose.yml e nas configurações da aplicação.