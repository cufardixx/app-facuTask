const  createEditBtn = document.querySelector("#create-task")
const   input = document.querySelector("#name-task")
const   taskBox = document.querySelector("#task-box")

//deploy en render.com ver la propiedad Origin del objeto WINDOWS 
//const baseUrl = "http://localhost:4000/api" ahora usamos
const baseUrl = `${window.origin}/api`


//variablo global
let TASK_TO_EDIT = null





createEditBtn.addEventListener("click",(e)=>{

    const creating = !TASK_TO_EDIT 
    const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`;
    const method = creating ? "POST" : "PUT";

    
    fetch(`${baseUrl}/${path}`, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: input.value}),
    }).then((res)=>{

        getTasks()
        input.value = ''
        TASK_TO_EDIT = null
        createEditBtn.innerText = "Crear tarea" 
        return res.json() 
    }).then((resJson)=>{
        console.log({resJson});
    })
})

function getTasks(){

    taskBox.innerHTML = null 

    fetch(`${baseUrl}/tasks`).then((res)=>{
        return res.json() 
    }).then((resJson)=>{

        const tasks = resJson.data  

        for (const task of tasks) {
            
            const tasksParrafo = document.createElement('p') 
            const contenedorTask = document.createElement('div')
            const deleteTaskBtn = document.createElement('button') 
            const btnCancel = document.createElement('button')

            deleteTaskBtn.innerText= 'Borrar'
            tasksParrafo.innerText = task.name 

            tasksParrafo.addEventListener('click', (e)=>{
                input.value = task.name
                createEditBtn.innerHTML = "Editar tarea"
                TASK_TO_EDIT = task 
                contenedorTask.appendChild(btnCancel)
                btnCancel.innerText="Cancelar edicion"
            })

            btnCancel.addEventListener('click',(e)=>{
                TASK_TO_EDIT= null
                input.value = ''
                createEditBtn.innerHTML = 'Crear tarea'
                btnCancel.remove()
                
            })

            
            deleteTaskBtn.setAttribute('id', task._id)
            deleteTaskBtn.addEventListener('click', (e)=>{
                
                const taskId = e.target.id

                fetch(`${baseUrl}/tasks/${taskId}`,{
                    method: "DELETE",
                }).then(()=>{
                    const taskDivContainer = deleteTaskBtn.parentElement
                    getTasks() 
                })
            })
     
            contenedorTask.appendChild(tasksParrafo)
            contenedorTask.appendChild(deleteTaskBtn)
            taskBox.appendChild(contenedorTask)
        }
    })
}

getTasks()