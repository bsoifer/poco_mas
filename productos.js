// leo el JSON que contiene, entre otras cosas, los nombres de los 100 productos
function cargarJSON(ruta) {
  return fetch(ruta)
    .then(res => res.json())
}

// creo 100 options, uno por cada producto. uso el atributo "nombre" de cada objeto
function llenarDatalist(datos, idDatalist) {
  const datalist = document.getElementById(idDatalist);

  datos.forEach(obj => {
    if(obj.nombre) {
      const option = document.createElement('option');
      option.value = String(obj.nombre).trim()
      datalist.appendChild(option);
    }
  });
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
      alert("Por favor, escribí o seleccioná un producto.");
      return;
    }

    fetch("database/productos.json")  //leo de nuevo el json
      .then((response) => response.json())
      .then((productosNombres) => {
        const productoSeleccionado = productosNombres.find(   //busco el id del producto que eligió el usuario (el input)
          (p) => String(p.nombre) === String(input)
        );

        if (!productoSeleccionado) {
          alert("Producto no encontrado. Elegí uno de la lista.");
          return;
        }

        const idProducto = productoSeleccionado.id_producto   //ID del producto que seleccionó el usuario
        
        console.log(idProducto)

        
    
    })
})