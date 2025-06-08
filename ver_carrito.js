document.getElementById("btnVolver").addEventListener("click", function () {
  window.location.href = "carrito.html"
})

document.addEventListener("DOMContentLoaded", function() {
    const carrito = JSON.parse(localStorage.getItem("carrito"))
    const titulo = document.getElementById("tituloCarrito")

    if(carrito === null){
        titulo.innerHTML = `
        <h2>Tu carrito está vacío</h2>
        <p>Todavía no agregaste ningún producto</p>`
    }else{
        if(!hayElementos(carrito)){
            titulo.innerHTML = `
            <h2>Tu carrito está vacío</h2>
            <p>Todavía no agregaste ningún producto</p>`
        }else{
            mostrarCarritoConItems(carrito)
            actualizarTitulo(carrito)
        }
    }

})

function hayElementos(carrito){
    let cantElementos = 0

    for(let i = 0; i<carrito.length; i++){
        cantElementos += carrito[i].cantidad
    }

    if(cantElementos > 0){
        return true
    }else{
        return false
    }
}

function mostrarCarritoConItems(carrito){
    const mensaje = document.getElementById("mostrarCarrito")
    mensaje.innerHTML = ""

    for(let i = 0; i<carrito.length; i++){
        const producto = carrito[i]

        if(producto.cantidad >= 1){
            const div = document.createElement("div")
            div.classList.add("card-producto")

            div.innerHTML = `
            <img src="img_productos/${producto.id_producto}.jpg" alt="${producto.productos_descripcion}">
            <h3>${producto.productos_descripcion}</h3>
            <p>EAN ${producto.id_producto}</p>
            <p><strong>Mínimo:</strong> $${producto.precio_minimo}</p>
            <p><strong>Máximo:</strong> $${producto.precio_maximo}</p>
            <div class="contador">
                <button class="btn-restar">-</button>
                <span class="cantidad">${producto.cantidad}</span>
                <button class="btn-sumar">+</button>
            </div>`

            const spanCantidad = div.querySelector(".cantidad");

            div.querySelector(".btn-sumar").addEventListener("click", function(){
                producto.cantidad++
                localStorage.setItem("carrito", JSON.stringify(carrito))
                actualizarTitulo(carrito)
                mostrarCarritoConItems(carrito)
            })

            div.querySelector(".btn-restar").addEventListener("click", function(){
                if(producto.cantidad > 0){
                    producto.cantidad--
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                    if(hayElementos(carrito)){
                        actualizarTitulo(carrito)
                        mostrarCarritoConItems(carrito)
                    }else{
                        const titulo = document.getElementById("tituloCarrito")
                        titulo.innerHTML = `<h2>Tu carrito está vacío</h2>
                        <p>Todavía no agregaste ningún producto</p>`

                        mensaje.innerHTML = ''

                    }
                    
                }
            })

            mensaje.appendChild(div)
        }
    }
}

function actualizarTitulo(carrito){
    let precioMinimo = 0
    let precioMaximo = 0

    for(let i = 0; i<carrito.length; i++){
        if(carrito[i].cantidad > 0){
            precioMinimo += Number(carrito[i].precio_minimo) * carrito[i].cantidad
            precioMaximo += Number(carrito[i].precio_maximo) * carrito[i].cantidad
        }
    }

    const dispersion = Math.round(((precioMaximo/precioMinimo)-1)*100)

    const titulo = document.getElementById("tituloCarrito")
    titulo.innerHTML = ''
    titulo.innerHTML = `<h2>El total de tu carrito varía entre $${precioMinimo} y $${precioMaximo}</h2>
    <p>Eso significa que tiene un ${dispersion}% de dispersión!</p>`
}