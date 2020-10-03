# ProjetoGerenciarEventos
O projeto envolve construir um calendario que gerencia os eventos. Foi utilizado bando de dados MongoDB e nodejs para o roteamento. Além disso, foi utilizado a arquitetura mvc para organizar os arquivos. O backend está finalizado e fornecendo todas as APIs importantes pra aplicação, o frontend não está totalmente finalizado, operações como registro de eventos ou edição de eventos não podem ser realizadas via frontend, apenas backend por enquanto. Embora essas funcionalidades não tenham sido finalizadas no frontend, a estrutura da pagina com as funcionalidades já se encontram montadas.

## Funcionalidades importantes e que foram cobridas na aplicação
Concluidas: Registro de usuario, autenticação do usuario, Busca de eventos por data, Busca de eventos relacionadas ao usuario que os criou, impedir sobreposição no cadastro de eventos e responsividade da aplicação, após a autenticação ou registro é informado os seus eventos para o dia atual (relacionadas apenas ao usuario), autenticação utilizando JSON Web Tokens.

Concluidas apenas no backend: Edição de eventos, criação de eventos, deletar eventos. 

### Como rodar
Na pasta raiz execute no terminal
```
npm install
```
Em seguida execute
```
docker-compose up -d
```
Logo a seguir pode ser executado o seguinte comando

```
npm start
```
A partir de então a aplicação estará rodando com as configurações do .env

Para finalizar o programa pode ser pressionado os botões ctrl+c, assim o nodemon para de ser executado

Para finalizar o container do banco execute
```
docker-compose down
```
