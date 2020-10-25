const mongoose = require('../../db');
const EventSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true,//obrigatorio
    },
    start:{
        type: Date,
        required: true,
    },
    end:{
        type: Date,
        required: true,
    },
    createdBy:{//Quem criou o evento
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description:{
        type: String,
        required: true,
        lowercase: true,
    }
});

 const Event = mongoose.model('Event', EventSchema);
 module.exports = Event;