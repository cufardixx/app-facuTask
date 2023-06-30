
const form = document.querySelector("form")
const inputEmail = document.querySelector("#inputEmail")
const inputCode = document.querySelector("#inputCodigo")
const btnCode = document.querySelector("#btnCodigo")


const baseBackendUrl = `${window.origin}/api`

btnCode.addEventListener("click", async function(e){
    e.preventDefault()
    console.log("pidiendo codigo")

    const res = await fetch(
        `${baseBackendUrl}/auth/login/${inputEmail.value}/code`,
    {
        method: "POST",
    })
    const resJson = await res.json()
    console.log({resJson});
})

form.addEventListener("sumbit", async function(e){
    e.preventDefault()
    console.log("Intentando iniciar sesion")

    const res = await fetch(
        `${baseBackendUrl}/auth/login/${inputEmail.value}`,
    {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code: inputCode.value})
    })
    const resJson = await res.json()
    console.log({resJson});
})