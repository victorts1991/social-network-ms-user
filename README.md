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
```


## ⚙️ CI/CD & Implantação Automatizada

O processo de Integração Contínua (CI) e Implantação Contínua (CD) é gerenciado diretamente pelo Render, garantindo que as atualizações de código sejam automaticamente implantadas nos ambientes corretos com base na estratégia de branching.

### Estratégia de Branching

Adotei uma estratégia simplificada para gerenciar os ambientes:

* **`main` Branch:**
    * Representa o código em **produção**.
    * Qualquer merge para `main` dispara uma implantação automatizada para o ambiente de **produção** no Render.
    * **URL de Produção:** [https://social-network-ms-user.onrender.com](https://social-network-ms-user.onrender.com) (Substitua pela URL real do seu serviço Render)

* **`develop` Branch:** (Integração Contínua e Validação)
    * É a branch principal de desenvolvimento onde as funcionalidades e correções são integradas após serem desenvolvidas em branches de feature. Todas as novas contribuições são feitas via **Pull Requests (PRs) para `develop`**.
    * **CI Automatizada (Testes):** Qualquer `push` ou `PR` aberto/sincronizado para a branch `develop` (ou para branches de feature que visam `develop`) aciona um pipeline de CI no GitHub Actions (`test-develop-branch` no seu workflow). Este pipeline **executa exclusivamente os testes automatizados**, garantindo a qualidade do código integrado.
    * **Finalidade:** A branch `develop` **não dispara implantações automatizadas** para um ambiente de desenvolvimento/staging no Render. Seu propósito é servir como um ponto de validação rigorosa de testes, assegurando que apenas código testado e aprovado possa progredir para a branch `main`.

### Regra de Proteção para a Branch `main` (Produção)

Para garantir que a branch `main` (que representa o código em produção) seja sempre estável e receba apenas código validado, configure as seguintes regras de proteção no GitHub:

1.  Vá para o seu repositório no GitHub.
2.  Clique em **`Settings`** (Configurações) > **`Branches`** (Branches).
3.  Na seção "Branch protection rules" (Regras de proteção de branch), clique em **`Add rule`** (Adicionar regra).

    * **Branch name pattern:** Digite `main` (para aplicar a regra à branch principal).
    * **`Require a pull request before merging` (Exigir um pull request antes de fazer merge):** Marque esta opção.
        * Isso garante que todas as mudanças para `main` passem por um PR, permitindo revisão e verificação.
    * **`Require status checks to pass before merging` (Exigir que as verificações de status passem antes de fazer merge):** Marque esta opção.
        * Na lista que aparecer abaixo, procure e **selecione os seguintes jobs do seu workflow do GitHub Actions**:
            * `Check PR for Main Origin`: Para garantir que o PR para `main` veio exclusivamente de `develop`.
            * `Run tests on develop branch`: (Opcional, mas **altamente recomendado**) Garante que os testes unitários/de integração da `develop` passaram antes que o código possa ser mesclado em `main`.
    * **`Require pull request reviews before merging` (Exigir revisões de pull request antes de fazer merge):** (Opcional, mas recomendado para produção) Marque esta opção para exigir que um ou mais revisores aprovem as mudanças.
    * **`Include administrators` (Incluir administradores):** (Opcional, mas recomendado) Marque esta opção para que as regras se apliquem também aos administradores do repositório.
    * Clique em **`Create`** (Criar) para salvar a regra.