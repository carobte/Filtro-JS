// Selectores necesarios para el proceso de login

const loginForm = document.querySelector("#login-form")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

// URL del json server donde se encuentran los usuarios
const URL_USERS = "http://localhost:3000/users"

// Función que valida la existencia del usuario, si existe retorna su información
async function validateUser(email) {
    const response = await fetch(`${URL_USERS}?email=${email.value}`)
    const data = await response.json() // Pasa del formato json a JS
    if (data.length === 1) {
        return data[0]
    } else {
        return false
    }
}

// Evento del inicio de sesión
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault() // Prevenir que la página se recargue
    const user = await validateUser(email) 
    if (!user) { // Si no existe el usuario
        alert("User not registred")
    } else if (user.password !== password.value) { // si existe pero su contraseña es incorrecta
        alert("Invalid password")
        password.value = ""
    } else { // si existe y su contraseña es correcta
        alert("Welcome " + user.username)
        localStorage.setItem("user", JSON.stringify(user)) // Ingresamos el usuario al localStorage para que persista en las diferentes vistas
        window.location.href = "./dashboard.html" // Redirige hacia el dashboard para que el usuario pueda manipular los productos
    }
    loginForm.reset() // Limpiamos el formulario
})

// Función que valida si ya inicio sesión
export function isLogged() {
    const user = localStorage.getItem("user")
    if (user) {
        window.location.href = "./dashboard.html"
    }
}

// Ejecución de la validación para el usuario (iniciado o no)
isLogged()