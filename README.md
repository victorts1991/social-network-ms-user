# 🚀 Social Network - Microsserviço de Usuários

Este é o microsserviço de gerenciamento de usuários central do ecossistema **Social Network**, projetado para oferecer autenticação segura e gestão de perfis de usuário. Ele é a espinha dorsal para qualquer interação do usuário com nossos serviços de social network.

## ✨ Funcionalidades Principais

* **Cadastro de Usuários:** Registro de novos usuários com e-mail, senha, nome completo e data de nascimento.
* **Gestão de Perfil:** Atualização e consulta de informações detalhadas do perfil do usuário, incluindo dados de endereço completo.

## 🛠️ Tecnologias Utilizadas

* **Backend Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Autenticação:** [Firebase Authentication](https://firebase.google.com/docs/auth)
* **Banco de Dados:** [Google Cloud Firestore](https://firebase.google.com/docs/firestore)
* **ORM/ODM:** Não utilizado diretamente (interação via Firebase Admin SDK)
* **Validação de Dados:** `class-validator` & `class-transformer`
* **Testes Unitários:** [Jest](https://jestjs.io/)

## 🚀 Como Começar

Siga estes passos para ter o microsserviço rodando em sua máquina local.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/download/) (versão 18.x ou superior recomendada)
* `npm` (gerenciador de pacotes do Node.js)
* Uma conta no [Firebase](https://firebase.google.com/) e um projeto configurado.

### Configuração do Projeto Firebase

1.  Acesse o [Console do Firebase](https://console.firebase.google.com/).
2.  Selecione/crie seu projeto (ex: `social-network`).
3.  Vá em **Authentication** e habilite os métodos de login (E-mail/Senha e Google).
4.  Vá em **Project settings** (ícone de engrenagem) > **Service accounts**.
5.  Clique em "Generate new private key" e salve o arquivo JSON. Este arquivo é crucial!
6.  **Habilite a API do Cloud Firestore:** No Console do Firebase, vá em **Firestore Database** e clique em "Criar banco de dados" ou habilite a API, se ainda não o fez.

### Instalação

1.  Clone este repositório;
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

### Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto e configure as credenciais do seu projeto Firebase. **Nunca compartilhe este arquivo publicamente!**

```dotenv
# .env

# Credenciais do Firebase Service Account (do arquivo JSON que você baixou)
# A CHAVE PRIVADA DEVE SER UMA ÚNICA LINHA, COM '\n' PARA QUEBRAS DE LINHA REAIS
FIREBASE_PROJECT_ID="seu-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_COMPLETA_AQUI_COM_QUEBRAS_DE_LINHA_LITERAL\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="seu-client-email"
