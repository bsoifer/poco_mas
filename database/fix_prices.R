library(readr)
library(tidyverse)
library(jsonlite)
options(scipen = 999)

nombres_productos <- read_json("database/nombres_productos.json")
productos <- read_json("database/productos.json")

nombres_productos[[1]][[1]]
productos[[1]][10]


# Para cada producto, encuentro su precio mínimo y la dirección de la sucursal donde se lo vende

precios_minimos <- c()
sucursales_minimos <- c()

for(i in c(1:length(nombres_productos))){
  print(i/length(nombres_productos))
  minimo <- 1000000
  row_minimo <- 0
  id_a_buscar <- nombres_productos[[i]][[1]]
  for(j in c(1:length(productos))){
    if(id_a_buscar == productos[[j]][[4]]){
      if(productos[[j]][[10]] < minimo & productos[[j]][[10]] > 0){
        minimo = productos[[j]][[10]]
        row_minimo = j
      }
    }
  }
  if(row_minimo == 0){
    precios_minimos <- c(precios_minimos, 0)
    sucursales_minimos <- c(sucursales_minimos, "no hay")
  }else{
    precios_minimos <- c(precios_minimos, minimo)
    sucursal_min <- paste0(productos[[row_minimo]][[15]], " ", productos[[row_minimo]][[16]])
    sucursales_minimos <- c(sucursales_minimos, sucursal_min)
  }
}



# Para cada producto encuentro su precio máximo y la sucursal donde se lo vende

precios_maximos <- c()
sucursales_maximos <- c()

for(i in c(1:length(nombres_productos))){
  print(i/length(nombres_productos))
  maximo <- 0
  row_maximo <- 0
  id_a_buscar <- nombres_productos[[i]][[1]]
  for(j in c(1:length(productos))){
    if(id_a_buscar == productos[[j]][[4]]){
      if(productos[[j]][[10]] > maximo & productos[[j]][[10]] > 0){
        maximo = productos[[j]][[10]]
        row_maximo = j
      }
    }
  }
  if(row_maximo == 0){
    precios_maximos <- c(precios_maximos, 0)
    sucursales_maximos <- c(sucursales_maximos, "no hay")
  }else{
    precios_maximos <- c(precios_maximos, maximo)
    sucursal_max <- paste0(productos[[row_maximo]][[15]], " ", productos[[row_maximo]][[16]])
    sucursales_maximos <- c(sucursales_maximos, sucursal_max)
  }
}


# Agrego precios mínimos, máxmos y sucursales al json
nombres_productos_filtrado <- list()

for(i in seq_along(nombres_productos)){
  if(precios_minimos[i] == 0 || precios_maximos[i] == 0){
    next
  } else {
    producto <- nombres_productos[[i]]
    
    producto$precio_minimo <- precios_minimos[i]
    producto$sucursal_minima <- sucursales_minimos[i]
    producto$precio_maximo <- precios_maximos[i]
    producto$sucursal_maxima <- sucursales_maximos[i]
    
    # Lo agrego a la nueva lista
    nombres_productos_filtrado <- append(nombres_productos_filtrado, list(producto))
  }
}

write_json(nombres_productos_filtrado, "productos.json", pretty = TRUE)
