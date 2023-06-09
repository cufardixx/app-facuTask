require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const Schema = mongoose.Schema

app.use(express.static('public', {extensions: ["html", "css", "js"]}))

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


//configuracion de ruta tipo POST en un middelware
app.post("/api/tasks", function(req, res) {
    const body = req.body;
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

//configuracion de ruta tipo GET en un middelware
app.get("/api/tasks", function(req,res){
    Task.find().then((tasks)=>{
        res.status(200).json({ok: true, data: tasks,})

    }).catch((err)=>{
        res.status(400).json({ok: false, message: "Error al encontrar la tarea ",err})
    })
})

//configuracion de ruta tipo DELETE en un middelware
app.delete("/api/tasks/:id", function(req, res) {
    const id = req.params.id; //me guardo el id
    Task.findByIdAndDelete(id).then((deletedTask)=>{
      res.status(200).json({ok: true, data:deletedTask})
    }).catch((err)=>{
      res.status(400).json({ok: false, message: "Error en eliminar tarea!"})
    })
  });


//configuracion de ruta tipo PUT en un middelware
app.put("/api/tasks/:id", function(req, res) {
    const body = req.body;
    const id = req.params.id
  
    Task.findByIdAndUpdate(id,{
      name: body.text,
    }).then((updateTask)=>{
      res.status(200).json({ok:true, data: updateTask})
    }).catch(()=>{
      res.status(400).json({ok:false, message: "Error al editar tarea!"})
    })
  });



app.listen(PORT, () => {
    console.log(`Escucho en el puerto ${PORT}`)
  })