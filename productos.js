// leo el JSON que contiene, entre otras cosas, los nombres de los productos
function cargarJSON(ruta) {
  return fetch(ruta)
    .then(res => res.json())
}

// creo options, uno por cada producto. uso el atributo "productos_descripcion" de cada objeto
function llenarDatalist(datos, idDatalist) {
  const datalist = document.getElementById(idDatalist)

  for(let i = 0; i < datos.length; i++) {
    if(datos[i].productos_descripcion) {
      const option = document.createElement('option')
      option.value = String(datos[i].productos_descripcion)
      datalist.appendChild(option)
    }
  }
}

// arranca todo el proceso, desde leer el json hasta poner el listado en el hrml
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
      alert("Por favor, escribí o seleccioná un producto.");
      return;
    }

    fetch("database/productos.json")  //leo de nuevo el json
      .then((response) => response.json())
      .then((productosNombres) => {
        const productoSeleccionado = productosNombres.find(   //busco el id del producto que eligió el usuario (el input)
          (p) => String(p.productos_descripcion) === String(input)
        );

        if (!productoSeleccionado) {
          alert("Producto no encontrado. Elegí uno de la lista.");
          return;
        }

        //const idProducto = productoSeleccionado.id_producto   //ID del producto que seleccionó el usuario
        //console.log(idProducto)

        const precioMin = productoSeleccionado.precio_minimo
        const precioMax = productoSeleccionado.precio_maximo
        const marca = productoSeleccionado.productos_marca
        const dispersion = Math.round(((precioMax/precioMin)-1) * 100, 2)
        const sucursal_minima = productoSeleccionado.sucursal_minima

        document.getElementById("resultadosBusqueda").innerHTML = 
        `<img src="img_productos/${productoSeleccionado.id_producto}.jpg" alt="${productoSeleccionado.productos_descripcion}" id ="foto-producto">
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Precio mínimo:</strong> $${precioMin}</p>
        <p><strong>Precio máximo:</strong> $${precioMax}</p>
        <p>El producto seleccionado tiene un ${dispersion}% de dispersión!
        <p>Te conviene comprar este producto en ${sucursal_minima}</p>`
    })
})

document.getElementById("btnReestablecer").addEventListener("click", function(){
  document.getElementById("resultadosBusqueda").innerHTML = ''
  document.getElementById("buscador-producto").value = ''
  
})