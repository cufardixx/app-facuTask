require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const trasporter = require('./helpers/mailer')

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

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  login_code: String,
})

//Generar la coleccion(Task) que va a almacenar documentos(task)
const Task = mongoose.model("Task", taskSchema)

const User = mongoose.model("User", userSchema)

app.post("/api/auth/login/:email/code", async function(req,res){
  const { email } = req.params 
  const user = await User.findOne({email})

  if(!user){
    //await User.create({email, firstName: "facundo", lastName: "picia"})
    return res.status(400).json({ ok: false, message: "No existe usuario con ese email" });
  }
  let code = ""
  for (let index = 0; index <= 5; index++) {
    let character = Math.ceil(Math.random()*9)
    code += character
  }
  console.log(code);
  user.login_code = code
  await user.save()

  const result = await trasporter.sendMail({
    from: `App Tareas ${process.env.EMAIL}`,
    to: email,
    subject: "Código de inicio de sesión: " + code,
    body: "Este es tu codigo para iniciar sesion!",
  })
  res.status(200).json({ok: true, message: "Codigo enviado con exito!"})
})


app.post("/api/auth/login/:email", async function(req,res){
  const { email } = req.params 
  const { code } = req.body

  const user = await User.findOne({email, login_code: code})

  if(!user){
    //await User.create({email, firstName: "facundo", lastName: "picia"})
    return res.status(400).json({ ok: false, message: "Credenciales invalidas" });
  }

  
  res.status(200).json({ok: true, message: "Inicio de sesión!"})
})


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