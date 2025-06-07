// crear el carrito (o leerlo si ya existía)
let carrito = []
const carritoGuardado = localStorage.getItem("carrito")

if(carritoGuardado === null){
  fetch("database/productos.json")
  .then(res => res.json())
  .then(productos => {
    for (let i = 0; i < productos.length; i++) {
      const nuevoProducto = {
        id_producto: productos[i].id_producto,
        categoria: productos[i].categoria,
        productos_descripcion: productos[i].productos_descripcion,
        productos_marca: productos[i].productos_marca,
        precio_minimo: productos[i].precio_minimo,
        precio_maximo: productos[i].precio_maximo,
        cantidad: 0
      }
      carrito.push(nuevoProducto)
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCatalogo(carrito)
  })
}else{
  const carrito = JSON.parse(carritoGuardado)
  mostrarCatalogo(carrito)
}


// mostrar el catálogo con todos los productos
function mostrarCatalogo(carrito) {
  const catalogo = document.getElementById("catalogo")

  for (let i = 0; i < carrito.length; i++) {
    const producto = document.createElement("div")
    producto.className = "card-producto"

    producto.innerHTML = `
      <img src="img_productos/${carrito[i].id_producto}.jpg" alt="${carrito[i].productos_descripcion}">
      <h3>${carrito[i].productos_descripcion}</h3>
      <p>EAN ${carrito[i].id_producto}</p>
      <p><strong>Mínimo:</strong> $${carrito[i].precio_minimo}</p>
      <p><strong>Máximo:</strong> $${carrito[i].precio_maximo}</p>
      <div class="contador">
        <button class="btn-restar">-</button>
        <span class="cantidad">${carrito[i].cantidad}</span>
        <button class="btn-sumar">+</button>
      </div>
    `

    const spanCantidad = producto.querySelector(".cantidad");

    producto.querySelector(".btn-sumar").addEventListener("click", function(){
      carrito[i].cantidad++
      localStorage.setItem("carrito", JSON.stringify(carrito))
      spanCantidad.innerHTML = ''
      spanCantidad.innerHTML = carrito[i].cantidad
    })

    producto.querySelector(".btn-restar").addEventListener("click", function(){
      if(carrito[i].cantidad > 0) {
        carrito[i].cantidad--
        localStorage.setItem("carrito", JSON.stringify(carrito))
        spanCantidad.innerHTML = ''
        spanCantidad.innerHTML = carrito[i].cantidad
      }
    })

    catalogo.appendChild(producto);
  }
}

// Se repiten los mismos procesos para buscar que en productos

// leo el JSON que contiene, entre otras cosas, los nombres de los productos
function cargarJSON(ruta) {
  return fetch(ruta)
    .then(res => res.json())
}

// creo options, uno por cada producto. uso el atributo "productos_descripcion" de cada objeto
function llenarDatalist(datos, idDatalist) {
  const datalist = document.getElementById(idDatalist)

  datos.forEach(obj => {
    if(obj.productos_descripcion) {
      const option = document.createElement('option')
      option.value = String(obj.productos_descripcion).trim()
      datalist.appendChild(option)
    }
  })
}

// arranca todo el proceso, desde leer el json hasta poner el litado en el hrml
function inicializarBuscador() {
  cargarJSON('database/productos.json')
    .then(datos => llenarDatalist(datos, 'sugerencias'))
}

// llamo a la función que arranca todo al principio
window.addEventListener('DOMContentLoaded', inicializarBuscador)


//////////////////////////////////////////////////////////////////////////////////////
//Accionar el botón de buscar

document.getElementById("btn-buscar").addEventListener("click", function () {
    const input = document.getElementById("buscador-producto").value.trim()

    if (!input) {
      alert("Por favor, escribí o seleccioná un producto.")
      return
    }

    fetch("database/productos.json")  //leo de nuevo el json
      .then((response) => response.json())
      .then((productosNombres) => {
        const productoSeleccionado = productosNombres.find(   //busco el id del producto que eligió el usuario (el input)
          (p) => String(p.productos_descripcion) === String(input)
        )

        if (!productoSeleccionado) {
          alert("Producto no encontrado. Elegí uno de la lista.")
          return
        }

        //const idProducto = productoSeleccionado.id_producto   //ID del producto que seleccionó el usuario
        //console.log(idProducto)

        const precioMin = productoSeleccionado.precio_minimo
        const precioMax = productoSeleccionado.precio_maximo
        const marca = productoSeleccionado.productos_marca
        
        document.getElementById("resultadosBusqueda").innerHTML = 
        `<img src="img_productos/${productoSeleccionado.id_producto}.jpg" alt="${productoSeleccionado.productos_descripcion}" id ="foto-producto">
        <p><strong>Marca:</strong> ${marca}</p>
        <p>EAN ${productoSeleccionado.id_producto}<p>
        <p><strong>Precio mínimo:</strong> $${precioMin}</p>
        <p><strong>Precio máximo:</strong> $${precioMax}</p>`

        document.getElementById("catalogo").innerHTML = ''
    })
})

document.getElementById("btnReestablecer").addEventListener("click", function(){
  document.getElementById("resultadosBusqueda").innerHTML = ''
  document.getElementById("buscador-producto").value = ''
  mostrarCatalogo(carrito)
})