//Docker-compose inicializa com a base de dados noderest
//E nessa base de dados criamos o usuario com senha, no qua eh feito a conexao

db.createUser(
    {
      user: "userE",
      pwd: "12345",
      roles: [
         { role: "readWrite", db: "noderest" }
      ]
    }
)