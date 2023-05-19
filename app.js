require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const { json } = require('stream/consumers')
const Schema = mongoose.Schema

app.use(express.static('public'))

app.use(express.json())

//conectar a MONGODB
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Conexion exitosa con la BD!');
}).catch((err)=>{
    console.log('Error en la conexion con la BD ', {err});
})

//Definir las restricciones de las tareas en la BD
const taskSchema = new Schema({
    name: String,
    done: Boolean,
    fecha: String,
})
//Generar la coleccion(Task) que va a almacenar documentos(task)
const Task = mongoose.model("Task", taskSchema)


//tipo POST en un middelware
app.post("/api/tasks", function(req, res) {
    const body = req.body;
    console.log({body});
    //conectar la BD con el back y front 
    Task.create({
        name: body.text,
        fecha: new Date(),
        done: false,
    }).then((createdTask)=>{
        res.status(201).json({ ok: true, message: "Tarea creada con éxito" });
    }).catch((err)=>{
        res.status(400).json({ ok: false, message: "ERROR al crear la tarea" });
    })
});

//tipo get en un middelgare
app.get("/api/tasks", function(req,res){
    Task.find().then((tasks)=>{
        res.status(200).json({ok: true, data: tasks})
    }).catch((err)=>{
        res.status(400).json({ok: false, message: "Error al encontrar la tarea ",err})
    })
})



app.listen(PORT, () => {
    console.log(`Escucho en el puerto ${PORT}`)
  })