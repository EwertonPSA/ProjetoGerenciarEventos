const express = require('express');
const User = require('../models/user');
const Event = require('../models/events');
const moment = require('moment');

/**
 * Essa funcao precisa passar por autenticacao
 * Antes, para que no body tenha o userId.
 * Essa funcao verifica se existe eventos
 * Dentro do intervalo que deseja cadastrar
 * Se tiver ok cria e associa o evento a quem criou(id)
 */
const create = async(req, res) => {
    var {dateStart, dateEnd, description, name} = req.body;
    dateStart = moment(dateStart).format();
    dateEnd = moment(dateEnd).format(); 
    try{
        const outrosEventos = await Event.find({
            //Verifica se o evento foi criado por quem deseja cadastrar
            createdBy:{'$eq':req.userId},
            //Pega todos eventos que atendem a qualquer uma dessas proximas condicoes
            "$or":[
                {
                    //Evento cadastrado que comeca dentro do nosso
                    start:{
                        '$gte': dateStart,
                        '$lte': dateEnd
                    }
                },
                {
                    //Evento cadastrado que termina dentro do nosso
                    end:{
                        '$gte': dateStart,
                        '$lte': dateEnd
                    }
                },
                {
                    //Nosso evento esta dentro de outro evento
                    "$and":[
                        {
                            //Evento que comeca antes do nosso
                            start:{
                                '$lte': dateStart
                            }
                        },
                        {
                            //Evento que termina depois do nosso
                            end:{
                                '$gte': dateEnd
                            }
                        }
                    ]
                }
            ]
        });
        
        if(outrosEventos.length !== 0){
            return res.status(400).send({error:{
                msg:'Não é permitido sobrepor eventos'},
                events: outrosEventos
            });
        }else{
            const event = await Event.create({
                start:dateStart,
                end:dateEnd,
                description:description,
                name:name,
                createdBy:req.userId,
            });
            return res.send(event);
        }     
    }catch (err){
        return res.status(500).send({error: {ms:'Erro ao criar novo evento'}});
    }
};

const listEventForUser = async(req, res)=>{
    try{
        var{dateStart, dateEnd} = req.body;

        dateStart = moment(dateStart);
        dateEnd = moment(dateEnd);
        const events = await Event.find({
            //Busca os que estao relacionado ao usuario
            createdBy:{'$eq':req.userId},
            //Busca eventos que estao estao dentro desse intervalo
            "$and":[
                {start:{'$gte': dateStart}},
                {end:{'$lte': dateEnd}}
            ]
        });
        return res.send( {events} );
        
    }catch(err){
        return res.status(500).send({error: {msg:'Erro na busca de eventos'}});
    }
};

//Listar todos eventos
const listAll = async(req, res)=>{
    try{
        const events = await Event.find();
        if(events.length===0){
            return res.send( {msg:"Nenhum evento encontrado"});
        }else{
            return res.send( {events} );
        }
    }catch(err){
        return res.status(500).send({error: {msg:'Erro na busca de eventos'}});
    }
};

//Listar eventos dentro de um intervalo de tempo
const list = async(req, res)=>{
    try{
        var {dateStart, dateEnd} = req.body;

        dateStart = moment(dateStart);
        dateEnd = moment(dateEnd);
        const events = await Event.find({
            //Busca eventos que estao estao dentro desse intervalo
            "$and":[
                {start:{'$gte': dateStart}},
                {end:{'$lte': dateEnd}}
            ]
        });
        return res.send( {events} );
        
    }catch(err){
        return res.status(500).send({error: {msg:'Erro na busca de eventos'}});
    }
};

//Informa os dados de um unico evento
const oneEvent = async(req, res)=>{
    try{
        var {dateStart, dateEnd} = req.body;
        // Resolver o fuso Horario
        dateStart = moment(dateStart);
        dateEnd = moment(dateEnd); 
        const event = await Event.findOne({
            name:name,
            start:dateStart,
            end:dateEnd
        })
        if(!event){
            return res.send( {msg:"Nenhum evento encontrado"});
        }else{
            return res.send( {event} );
        }
    }catch(err){
        return res.status(500).send({error: {msg:'Erro na busca de eventos'}});
    }
};

//Deletar um evento
const deleteEvent = async(req, res)=>{
    try{
        var {name, dateStart, dateEnd} = req.body;
        // Resolver o fuso Horario
        dateStart = moment(dateStart);
        dateEnd = moment(dateEnd); 

        const event = await Event.findOneAndRemove({
            name:name,
            start:dateStart,
            end:dateEnd
        })
        if(!event){
            return res.status(400).send({error: {msg:'Evento nao encontrado'}});
        }
        const msg = 'Evento excluido';
        return res.send({succes:msg});
    }catch(err){
        return res.status(500).send({error: 'Erro ao deletar evento'});
    }
};

//Editar um evento
const edit = async(req, res)=>{
    try{
        const event = await Event.findById(req.params.eventId);
        if(!event){
            return res.status(400).send({error: {msg:'Evento nao encontrado'}});
        }
        if(req.body.hasOwnProperty('name')){
            event.name = req.body.name;
        }
        if(req.body.hasOwnProperty('dateStart')){
            event.start = req.body.dateStart;
        }
        if(req.body.hasOwnProperty('dateEnd')){
            event.end = req.body.dateEnd;
        }
        if(req.body.hasOwnProperty('description')){
            event.description = req.body.description;
        }

        await Event.findByIdAndUpdate(event._id, event);
        const msg = 'Evento editado';
        return res.send({succes:msg});
    }catch(err){
        return res.status(500).send({error: 'Erro ao editar evento'});
    }
};

module.exports = {
    create,
    listAll,
    list,
    deleteEvent,
    edit,
    oneEvent,
    listEventForUser
};