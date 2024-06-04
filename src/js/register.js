// Selectores necesarios para el proceso de registro

const registerForm = document.getElementById("register-form")
const name = document.querySelector("#name")
const username = document.querySelector("#username")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

// URL del json server donde se encuentran los usuarios
const URL_USERS = "http://localhost:3000/users"

// Evento del submit en el formulario
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault() // Prevenir que se recargue

    // Validamos si el usuario existe en nuestra base de datos
    const user = await validateUser(email) 
    if (user) {
        alert("User already exists, please login") 

    // si no existe, creamos el usuario y lo dirigimos al login para que pueda iniciar sesión
    } else {
        await createUser(name, username, email, password)
        alert("User registered successfully")
        window.location.href="./login.html"
    }

})

// Función que valida si el usuario ya existe en la base de datos
async function validateUser(email) {
    const response = await fetch(`${URL_USERS}?email=${email.value}`)
    const data = await response.json() // Pasa del formato json a JS
    if (data.length === 1) {
        return true
    } else {
        return false
    }
}

// Función para crear el usuario en la base de datos
async function createUser(name, username, email, password) {
    // Creamos el objeto con la información del nuevo usuario
    const newUser = {
        "name": name.value,
        "username": username.value.trim(), // se guarda el nombre de usuario sin espacios
        "email": email.value,
        "password": password.value
    }

    // Enviamos el nuevo usuario a la base de datos
    await fetch(`${URL_USERS}`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })   
}