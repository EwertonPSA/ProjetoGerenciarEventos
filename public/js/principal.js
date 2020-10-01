
function Mudarestado(el) {
    var display = document.getElementById(el).style.display;
    if(display == "none")
        document.getElementById(el).style.display = 'block';
    else
        document.getElementById(el).style.display = 'none';
};

function incluirMsgErroDeAutenticacao(identificador, msg){
    document.querySelector(identificador).innerHTML = msg;
}

function usuarioComAutenticacao(){
    $('#usuario-info').show();
    $('.usuario-autenticado-eventos').show();
    $('#btn-register-login').hide();
    $('#btn-desconectar').show()
    $('.trash_link').hide();
    $('.edit_link').hide();
    
    document.querySelector(".Titulo_Consulta_Evento").innerHTML = 'Seus Eventos Do Dia';
    document.querySelector("#usuario-info i").innerHTML = localStorage.getItem('nome_usuario');
};

function usuarioSemAutenticacao(){
    $('#usuario-info').hide();
    $('.usuario-autenticado-eventos').hide();
    $('#btn-register-login').show();
    $('#btn-desconectar').hide()
    $('.trash_link').hide();
    $('.edit_link').hide();
    document.querySelector(".Titulo_Consulta_Evento").innerHTML = 'Todos Eventos Do Dia';
};

function limpar_dados_usuario(){
    localStorage.removeItem('token_usuario');
    localStorage.removeItem('nome_usuario');
    localStorage.removeItem('email_usuario');
}

/**
 * Repassa o token para obter o id a partir do middlware.
 * Busca eventos que possui o id do usuario como criacao
 * E esteja na data atual
 * Model usuario TEM Q GUARDAR O ID DO USUARIO, NESSA ETAPA
 * O USUARIO NAO PRECISA GUARDAR OS ID DOS EVENTOS, APENAS
 * SE EU FIZESSE UM SISTEMA DE CONVITE(NAO VAI ROLAR)
 * 
 * 
 * BUSCAR EVENTOS OU QUE COMECAM HOJE, OU QUE TEMINAM HOJE
 * OU AMBOS-> OR
 */
async function consultaEventosDoUsuarioNoDia(){
    const eventos = [];
    return eventos;
}

/**
 * Busca eventos que esteja na data atual
 */
async function consultaTodosEventosDoDia(){
    const eventos = [];
    return eventos;
}

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
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){
                incluirMsgErroDeAutenticacao("#msg_form_login b", json.error.msg);
            }else{
                incluirMsgErroDeAutenticacao(".msg_error_auth b", "");
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
                incluirMsgErroDeAutenticacao("#msg_form_register b", json.error.msg);
            }else{
                incluirMsgErroDeAutenticacao(".msg_error_auth b", "");
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
    
    /*A partir da autenticacao escondemos ou exibimos funcionalidades*/
    if(usuarioAutenticado === true){ 
        usuarioComAutenticacao();
        consultaEventosDoUsuarioNoDia()
        .then(eventos=>{
            eventos.length===0 ? $('.nenhumEvento').show(): $('.nenhumEvento').hide();
        }).catch(err=>{
            console.log(err);
        });
    }else{
        usuarioSemAutenticacao();
        consultaTodosEventosDoDia()
        .then(eventos=>{
            eventos.length===0 ? $('.nenhumEvento').show(): $('.nenhumEvento').hide();
        }).catch(err=>{
            console.log(err);
        });
    }

    $('#btn-desconectar').click( function(){
        limpar_dados_usuario();
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