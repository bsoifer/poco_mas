document.addEventListener('DOMContentLoaded', function () {
  const imagenes = document.querySelectorAll('.carrusel-img')
  let indiceActual = 0

  function mostrarImagen(indice) {
    imagenes.forEach((img, i) => {
      img.classList.toggle('active', i === indice)
    })
  }

  function siguienteImagen() {
    indiceActual = (indiceActual + 1) % imagenes.length
    mostrarImagen(indiceActual)
  }

  mostrarImagen(indiceActual)
  setInterval(siguienteImagen, 3000)
})