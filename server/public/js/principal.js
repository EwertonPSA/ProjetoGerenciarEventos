/**
 * 
 * @param {String} identificador identificador no html
 * @param {String} msg mensagem a ser incluida na div do identificador repassado
 */
function incluirMsg(identificador, msg){
    document.querySelector(identificador).innerHTML = msg;
}

/**
 * Faz mudanças apropriadas no html principal
 * Quando o usuario esta autenticado
 */
function usuarioComAutenticacao(){
    $('#usuario-info').show();
    $('.usuario-autenticado-eventos').show();
    $('#btn-register-login').hide();
    $('#btn-desconectar').show()
    document.querySelector("#usuario-info i").innerHTML = localStorage.getItem('nome_usuario');
};

/**
 * Faz mudanças apropriadas no html quando o usuario nao
 * esta autenticado
 */
function usuarioSemAutenticacao(){
    $('#usuario-info').hide();
    $('.usuario-autenticado-eventos').hide();
    $('#btn-register-login').show();
    $('#btn-desconectar').hide()
    $('.trash_link').hide();
    $('.edit_link').hide();
    $('#div_funcionalidades').hide();
    document.querySelector(".Titulo_Consulta_Evento").innerHTML = 'Todos Eventos Do Dia';
};

/**
 * Funcao que limpa os dados armazenados no localstorage
 */
function limpar_dados_usuario(){
    localStorage.removeItem('token_usuario');
    localStorage.removeItem('nome_usuario');
    localStorage.removeItem('email_usuario');
}

/**
 * Usado para consultar eventos disponiveis
 * Na data atual
 */
async function consultaEventosDoUsuarioNoDia(){
    limparDiv('eventos_a_serem_exibidos');
    document.querySelector(".Titulo_Consulta_Evento").innerHTML = 'Seus Eventos Do Dia';
    const nowInicio = new Date();
    const nowFim = new Date();
    nowInicio.setHours(00,00,00);
    nowFim.setHours(23,59,59);
    const option = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({dateStart:nowInicio, dateEnd:nowFim}),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('token_usuario')}`
        },
    };
    await fetch('http://localhost:9001/event/listEventForUser', option)
    .then(res => {
        return res.json();
    }).then(json => {
        if(json.hasOwnProperty('error')){ alert(json.error.msg) }
        else if(json.events.length===0){
            incluirMsg('.msg_tela_principal', 'Nenhum evento encontrado');
            $('.msg_tela_principal').show();
        }else{
            incluirEventosNaDiv('#eventos_a_serem_exibidos', json.events, false, false);
            incluirMsg('.msg_tela_principal', '');
            $('.msg_tela_principal').hide();
        }
    })
    .catch(error => console.log(error));
}


/**
 * Funcao que inclui os eventos no html
 * @param {String} div_identificador classe ou id no html
 * @param {Objects} events conjunto de eventos a serem incluidos no html
 * @param {Boolean} editIsActive Se deve ser incluido icone de edicao no evento
 * @param {Boolean} deleteIsActive Se deve ser incluido icone de lixo no evento
 */
function incluirEventosNaDiv(div_identificador, events, editIsActive, deleteIsActive){
    const len = events.length;
    var months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", 
        "JUNHO", "JULHO", "AUGUSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
    var days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"];
    var iconEdit = '';
    var iconTrash = '';
    if(deleteIsActive){
        iconTrash ='<button class="btn trash_link float-right fa fa-trash-o fa-2x"></button>';
    }
    if(editIsActive){
        iconEdit = '<button class="btn edit_link float-right fa fa-pencil-square-o fa-2x"></button>';
    }
    events.forEach(singleEvent => {
        var startEvent = new Date(singleEvent.start);
        var endEvent = new Date(singleEvent.end);
        var eventFormat = '<div class="eventos_do_dia d-inline-flex">';
        eventFormat += `<div class="caixa_mes_dia"> <h1 class="display-3"><span class="badge badge-secondary">${startEvent.getDate()}</span></h1>`;
        eventFormat += `<h6>${months[startEvent.getMonth()]}</h6>`;
        eventFormat += '</div>';
        eventFormat += '<div class="info_detalhada_evento">';
        eventFormat += '<div>';
        eventFormat += iconEdit;
        eventFormat += iconTrash;
        eventFormat += `<h3 class="text-uppercase">${singleEvent.name}<strong></strong></h3>`;
        eventFormat += '</div>';
        eventFormat += '<ul class="list-inline">';
        eventFormat += `<li class="list-inline-item"><i class=" fa fa-calendar-o" aria-hidden="true"></i> ${days[startEvent.getDay()]}</li>`;
        eventFormat += `<li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> ${startEvent.getHours()}:${startEvent.getMinutes()} - </li>`;
        eventFormat += `<li class="list-inline-item"><i class="fa fa-calendar-o" aria-hidden="true"></i> ${days[endEvent.getDay()]} </li>`;
        eventFormat += `<li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> ${endEvent.getHours()}:${endEvent.getMinutes()} </li>`;
        eventFormat += '</ul>';
        eventFormat += `<p>${singleEvent.description}</p>`;
        eventFormat += '</div>';
        eventFormat += '</div>';
        $(div_identificador).append(eventFormat);
    });
}

/**
 * Busca todos eventos que disponiveis na data atual
 */
async function consultaTodosEventosDoDia(){
    limparDiv('eventos_a_serem_exibidos');
    const nowInicio = new Date();
    const nowFim = new Date();
    nowInicio.setHours(00,00,20);
    nowFim.setHours(23,59,57);
    const option = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({dateStart:nowInicio, dateEnd:nowFim}),
        headers: {
            'Content-Type' : 'application/json',
        },
    };
    await fetch('http://localhost:9001/event/list', option)
    .then(res => {
        return res.json();
    })
    .then(json => {
        if(json.hasOwnProperty('error')){ alert(json.error.msg) }
        else if(json.events.length===0){
            incluirMsg('.msg_tela_principal', 'Nenhum evento encontrado');
            $('.msg_tela_principal').show();
        }else{
            incluirEventosNaDiv('#eventos_a_serem_exibidos', json.events, false, false);
            incluirMsg('.msg_tela_principal', '');
            $('.msg_tela_principal').hide();
        }
    }).catch(error => console.log(error));
}

/**
 * Funcao que adiciona eventos e associa ao usuario
 */
async function criaEventos(event, form){
    alert('Funcionalidade nao se encontra disponivel no frontend ainda!');
}

async function buscaEventos(event, form){
    limparDiv('eventos_a_serem_exibidos');

    event.preventDefault();//Evita q chame o GET por padrao
    var dateStart = form.busca_inicioEvento.value +'T'+ form.busca_horaInicio.value;
    var dateEnd = form.busca_fimEvento.value +'T'+ form.busca_horaFim.value;
  
    if(dateStart != undefined && dateEnd != undefined){
        const option = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({dateStart:dateStart, dateEnd:dateEnd}),
            headers: {
                'Content-Type' : 'application/json'
            },
        };
        await fetch('http://localhost:9001/event/list', option)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){ alert(json.error.msg) }
            else if(json.events.length===0){
                incluirMsg('.msg_tela_principal', 'Nenhum evento encontrado');
                $('.msg_tela_principal').show();
            }else{
                incluirEventosNaDiv('#eventos_a_serem_exibidos', json.events, false, false);
                incluirMsg('.msg_tela_principal', '');
                $('.msg_tela_principal').hide();
            }
        }).catch(error => console.log(error));
    }
}


async function editListEventos(event, form){
    limparDiv('eventos_a_serem_exibidos');

    /**Primeira parte eh a busca */

    event.preventDefault();//Evita q chame o GET por padrao
    var dateStart = form.edit_inicioEvento.value +'T'+ form.edit_horaInicio.value;
    var dateEnd = form.edit_fimEvento.value +'T'+ form.edit_horaFim.value;
    if(dateStart != undefined && dateEnd != undefined){
        const option = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({dateStart:dateStart, dateEnd:dateEnd}),
            headers: {
                'Content-Type' : 'application/json'
            },
        };
        await fetch('http://localhost:9001/event/list', option)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){ alert(json.error.msg) }
            else if(json.events.length===0){
                incluirMsg('.msg_tela_principal', 'Nenhum evento encontrado');
                $('.msg_tela_principal').show();
            }else{
                incluirEventosNaDiv('#eventos_a_serem_exibidos', json.events, true, false);
                incluirMsg('.msg_tela_principal', '');
                $('.msg_tela_principal').hide();
            }
        }).catch(error => console.log(error));
    }
}

/**
 * Essa funcao faz primeiramente a busca dos eventos que se deseja
 * Deletar. Ao listar os eventos eh incluido um icone
 * Que seria utilizado para remover o evento desejado
 */
async function remove_ListEventos(event, form){
    limparDiv('eventos_a_serem_exibidos');

    /**Primeira parte eh a busca */

    event.preventDefault();//Evita q chame o GET por padrao
    var dateStart = form.remove_inicioEvento.value +'T'+ form.remove_horaInicio.value;
    var dateEnd = form.remove_fimEvento.value +'T'+ form.remove_horaFim.value;
    if(dateStart != undefined && dateEnd != undefined){
        const option = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({dateStart:dateStart, dateEnd:dateEnd}),
            headers: {
                'Content-Type' : 'application/json'

            },
        };
        await fetch('http://localhost:9001/event/list', option)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){ alert(json.error.msg) }
            else if(json.events.length===0){
                incluirMsg('.msg_tela_principal', 'Nenhum evento encontrado');
                $('.msg_tela_principal').show();
            }else{
                incluirEventosNaDiv('#eventos_a_serem_exibidos', json.events, false, true);
                incluirMsg('.msg_tela_principal', '');
                $('.msg_tela_principal').hide();
            }
        }).catch(error => console.log(error));
    }
}

/**
 * Acessa os dados do form, realiza a autenticao
 * Consome a resposta da api no formato json
 * Registra os dados no localstorage
 */
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
                incluirMsg("#msg_form_login b", json.error.msg);
            }else{
                incluirMsg(".msg_error_auth b", "");//Apaga todas mensagens de erro
                localStorage.setItem('token_usuario', json.token);
                localStorage.setItem('nome_usuario', json.user.name);
                localStorage.setItem('email_usuario', json.user.email);
                usuarioComAutenticacao();
                $('#div_funcionalidades').hide();
                $('#div_removerEvento').hide();
                $('#div_Buscar').hide();
                $('#div_criarEvento').hide();
                $('#div_editarEvento').hide();
                consultaEventosDoUsuarioNoDia();
            }
        }).catch(error => console.log(error));
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
                'Content-Type' : 'application/json',
            },
        };
        await fetch('http://localhost:9001/auth/register', option)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if(json.hasOwnProperty('error')){
                incluirMsg("#msg_form_register b", json.error.msg);
            }else{
                incluirMsg(".msg_error_auth b", ""); //Apaga todas mensagens de erro
                localStorage.setItem('token_usuario', json.token);
                localStorage.setItem('nome_usuario', json.user.name);
                localStorage.setItem('email_usuario', json.user.email);
                usuarioComAutenticacao();
                $('#div_funcionalidades').hide();
                $('#div_removerEvento').hide();
                $('#div_Buscar').hide();
                $('#div_criarEvento').hide();
                $('#div_editarEvento').hide();
                consultaEventosDoUsuarioNoDia();
            }
        })
        .catch(error => console.log(error));
    }
};

function limparDiv(div_identificador){
    const parent = document.getElementById(div_identificador);
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

$(document).ready(function(){
    usuarioAutenticado = (localStorage.getItem('token_usuario') !== null);
    
    /*A partir da autenticacao decidimos se 
      escondemos ou exibimos funcionalidades*/
    if(usuarioAutenticado === true){
        usuarioComAutenticacao();
        consultaEventosDoUsuarioNoDia();
    }else{
        usuarioSemAutenticacao();
        consultaTodosEventosDoDia();
    }

    $('#btn-desconectar').click( function(){
        limpar_dados_usuario();
        usuarioSemAutenticacao();
        consultaTodosEventosDoDia();
    });

    $('#logo_link').click(function (){
        $('.Titulo_Consulta_Evento').hide();
        $('#div_funcionalidades').hide();
        $('#div_removerEvento').hide();
        $('#div_Buscar').hide();
        $('#div_criarEvento').hide();
        $('#div_editarEvento').hide();
    });

    $("#buscarEvento").click(async function(){
        $('.Titulo_Consulta_Evento').hide();
        limparDiv('eventos_a_serem_exibidos');
        $('#div_funcionalidades').show();
        $('#div_removerEvento').hide();
        $('#div_Buscar').show();
        $('#div_criarEvento').hide();
        $('#div_editarEvento').hide();
    });

    $("#editarEvento").click(async function(){
        $('.Titulo_Consulta_Evento').hide();
        limparDiv('eventos_a_serem_exibidos');
        $('#div_funcionalidades').show();
        $('#div_removerEvento').hide();
        $('#div_Buscar').hide();
        $('#div_criarEvento').hide();
        $('#div_editarEvento').show();
    });

    $("#criarEvento").click(async function(){
        $('.Titulo_Consulta_Evento').hide();
        limparDiv('eventos_a_serem_exibidos');
        $('#div_funcionalidades').show();
        $('#div_Buscar').hide();
        $('#div_criarEvento').show();
        $('#div_editarEvento').hide();
        $('#div_removerEvento').hide();
    });

    $("#removerEvento").click(async function(){
        $('.Titulo_Consulta_Evento').hide();
        limparDiv('eventos_a_serem_exibidos');
        $('#div_funcionalidades').show();
        $('#div_Buscar').hide();
        $('#div_criarEvento').hide();
        $('#div_editarEvento').hide();
        $('#div_removerEvento').show();
    });
});