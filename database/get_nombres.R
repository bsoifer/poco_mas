library(readr)
library(tidyverse)
library(jsonlite)

productos_final <- read_csv("database/productos_final.csv")

# Obtengo los nombres de los productos
nombres_productos <- productos_final %>% group_by(id_producto, productos_descripcion, productos_marca) %>% summarise(n = n()) %>% 
  arrange(id_producto) %>% slice_head(n = 1)

# Columna nombre
nombres_productos$nombre <- paste0("PRODUCTO: ", nombres_productos$productos_descripcion, ". MARCA: ", nombres_productos$productos_marca)

write_json(nombres_productos, "nombres_productos.json", pretty = TRUE)

