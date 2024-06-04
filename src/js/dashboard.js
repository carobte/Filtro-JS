// Selectores para manipulación del DOM
const btnLogout = document.querySelector("#logout")
const tbody = document.querySelector("#tbody")

// Formulario e inputs
const productsForm = document.querySelector("#products-form")
const name = document.querySelector("#name")
const img = document.querySelector("#image")
const description = document.querySelector("#description")
const price = document.querySelector("#price")
const amount = document.querySelector("#amount")
const type = document.querySelector("#type")

// Id para controlar si se crea o se edita un producto
let id

// Ruta del json server donde están los productos
const URL_PRODUCTS = "http://localhost:3000/products"

// Función guardián que valida si el usuario está logueado
function isLogged() {
    const user = localStorage.getItem("user")
    if (!user) {
        window.location.href = "./login.html"
    } else {
        return user
    }
}

// Función para cerrar sesión
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user")
    window.location.href="../../index.html"
})

// Evento del submit en el formulario de productos 
productsForm.addEventListener("submit", async (event) => {
    event.preventDefault() // Prevenir que se recargue la página
    const productInfo = { // Obtengo y guardo en productInfo los valores de los inputs
        "name": name.value,
        "img": img.value,
        "description": description.value,
        "price": price.value,
        "amount": amount.value,
        "type": type.value
    }

    // Si no hay un id, creará el producto.
    if (!id) {
        await createProduct(productInfo)
        alert("Product created successfully")
    
    // Si ya hay un id, lo editará
    } else { 
        await updateProduct(id, productInfo)
        alert("Product updated successfully")
        id = undefined // Se coloca undefined para permitir crear o editar nuevamente
    }
    
    productsForm.reset() // Limpiar el formulario

    // Imprimir nuevamente la tabla actualizada
    await indexProducts()
})

// Eventos en tbody para editar y eliminar
tbody.addEventListener("click", async (event) => {

    // Valores para editar y redirige hacia el formulario
    if (event.target.classList.contains("btn-warning")) {
        id = event.target.getAttribute("data-id")
        const product = await getProduct(id)
        name.value = product.name
        img.value = product.img
        description.value = product.description
        price.value = product.price
        amount.value = product.amount
        type.value = product.type
        window.location.href = "#products-form"

    // Eliminar un producto
    } else if (event.target.classList.contains("btn-danger")) {
        let idDelete = event.target.getAttribute("data-id")
    
        if (confirm("Are you sure you want to delete this product?")) { // Confirmación para eliminar el producto
            await deleteProduct(idDelete)
            alert("Product deleted")
            await indexProducts() // Se imprime nuevamente la tabla actualizada
        }
    }
})

// Función para pintar los productos actuales
async function indexProducts() {
    const response = await fetch(`${URL_PRODUCTS}`)
    const data = await response.json() // Traer el array de productos
    tbody.innerHTML = "" // Limpio la tabla para asegurarme que se llene con los productos de la base de datos

    // Por cada producto creo un tr con su contenido
    data.forEach(product => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td class="text-capitalize">${product.name}</td>
        <td>
            <img src="${product.img}" height="100px" alt="${product.name}">
        </td>
        <td>$${product.price}</td>
        <td id="amount${product.id}">${product.amount}</td>
        <td id="availability${product.id}"></td>
        <td>$${product.price * product.amount}</td>
        <td>
            <button data-id=${product.id} class="btn btn-warning">Edit</button>
            <button data-id=${product.id} class="btn btn-danger">Delete</button>
        </td>
        `
        // Por cada tr, lo imprimo en tbody, que es su contenedor
        tbody.appendChild(tr)

        // Obtengo el td de disponibilidad(availability) y cantidad(amount) de cada uno para
        // manipular sus estilos
        const availability = document.querySelector(`#availability${product.id}`)
        const amount = document.querySelector(`#amount${product.id}`)

        // Si cantidad es mayor que 0, el producto se encuentra disponible
        if (product.amount > 0) {
            availability.textContent = "available"
            amount.classList.add("text-success", "fw-bolder")
            availability.classList.add("text-success", "fw-bolder", "text-capitalize")
        
        // Si cantidad es 0, significa que los productos no están disponibles
        } else {
            availability.textContent = "sold out"
            availability.classList.add("text-danger", "fw-bolder", "text-capitalize")
            amount.classList.add("text-danger", "fw-bolder")
        }
    })
}

// Funciones del JSON server

// Función para crear un producto
async function createProduct(productInfo) {  // El parámetro es el producto que queremos crear
    await fetch(`${URL_PRODUCTS}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productInfo)
    })
}

// Función para obtener un producto específico
async function getProduct(id) { // El parámetro es el id del producto que deseamos encontrar
    const response = await fetch(`${URL_PRODUCTS}/${id}`)
    const data = response.json()
    return data
}

// Función para editar un producto
async function updateProduct(id, productInfo) { // Los parámetros son: el id del producto que queremos editar y su información
    await fetch(`${URL_PRODUCTS}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productInfo)
    })
}

// Función para eliminar un producto
async function deleteProduct(id) { // Parámetro el id del producto a eliminar
    await fetch(`${URL_PRODUCTS}/${id}`, {
        method: "DELETE"
    })
}

// Ejecución funciones cuando carga esta vista:

// Ejecución impresión productos
indexProducts()

// Ejecución de la función guardián
isLogged()