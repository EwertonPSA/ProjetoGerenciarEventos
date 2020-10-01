
function Mudarestado(el) {
    var display = document.getElementById(el).style.display;
    if(display == "none")
        document.getElementById(el).style.display = 'block';
    else
        document.getElementById(el).style.display = 'none';
};

function usuarioComAutenticacao(){
    $('#usuario-info').show();
    $('.usuario-autenticado-eventos').show();
    $('#btn-register-login').hide();
    $('#btn-desconectar').show()
    document.querySelector("#usuario-info i").innerHTML = localStorage.getItem('nome_usuario');
};

function usuarioSemAutenticacao(){
    $('#usuario-info').hide();
    $('.usuario-autenticado-eventos').hide();
    $('#btn-register-login').show();
    $('#btn-desconectar').hide()
};

async function fazerLogin(event, form){
    event.preventDefault();//Evita q chame o GET por padrao
    const email = form.email_login.value;
    const password = form.senha_login.value;
    if(email != undefined && password != undefined){
        const option = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({email:email, password:password}),
            headers: {
                'Content-Type' : 'application/json'
            },
        };
        await fetch('http://localhost:9001/auth/authenticate', option)
        .then(res => res.json())
        .then(json => {
            if(json.hasOwnProperty('error')){
                alert(json.error.msg);
            }else{
                localStorage.setItem('token_usuario', json.token);
                localStorage.setItem('nome_usuario', json.user.name);
                localStorage.setItem('email_usuario', json.user.email);
                usuarioComAutenticacao();
            }
        })
        .catch(error => console.log(error));
    }
};

/**
 * Acessa os dados do form, cadastra o usuario
 * Consome a resposta da api no formato json
 * Registra os dados no localstorage
 */
async function fazerCadastro(event, form){
    event.preventDefault();//Evita q chame o GET por padrao
    const name = form.name_register.value;
    const email = form.email_register.value;
    const password = form.senha_register.value;
    if(name != undefined && email != undefined && password != undefined){
        const option = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({name:name, email:email, password:password}),
            headers: {
                'Content-Type' : 'application/json'
            },
        };
        await fetch('http://localhost:9001/auth/register', option)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){
                alert(json.error.msg);
            }else{
                localStorage.setItem('token_usuario', json.token);
                localStorage.setItem('nome_usuario', json.user.name);
                localStorage.setItem('email_usuario', json.user.email);
                usuarioComAutenticacao();
            }
        })
        .catch(error => console.log(error));
    }
};



$(document).ready(function(){
    usuarioAutenticado = (localStorage.getItem('token_usuario') !== null);
    if(usuarioAutenticado === true){ 
        usuarioComAutenticacao();
        //Busca o nome do usuario autenticado para incluir no html
        
    }else{//usuario nao autenticado
        usuarioSemAutenticacao();
    }

    $('#btn-desconectar').click( function(){
        localStorage.removeItem('token_usuario');
        localStorage.removeItem('nome_usuario');
        localStorage.removeItem('email_usuario');
    });

    $("#buscar").click(async function(){
        const option = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };
        await fetch('http://localhost:9001/buscar', option)
        .then(response => response.json())
        .then(data =>{//Guarda as variaveis no localStorage e atualiza html
            localStorage.setItem('nome_usuario', data.teste);
            document.querySelector("#usuario-info i").innerHTML = data.teste;
        })
        .catch(error => console.log(error));
    });
});