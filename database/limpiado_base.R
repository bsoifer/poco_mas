library(tidyverse)
library(readr)


#############################################################################
comercios <- read_delim("2025-06-02/comercio_1/comercio.csv", 
                       delim = "|", escape_double = FALSE, trim_ws = TRUE)

for(i in c(2:6)){
  comercio <- read_delim(paste0("2025-06-02/comercio_",i,"/comercio.csv"), delim = "|", escape_double = FALSE, trim_ws = TRUE)
  comercios <- comercios %>% rbind(comercio)
}

comercios <- comercios %>% filter(! is.na(id_bandera))

##############################################################################
sucursales <- read_delim("2025-06-02/comercio_1/sucursales.csv", 
                        delim = "|", escape_double = FALSE, trim_ws = TRUE)

for(i in c(2:6)){
  sucursal <- read_delim(paste0("2025-06-02/comercio_",i,"/sucursales.csv"), delim = "|", escape_double = FALSE, trim_ws = TRUE)
  sucursales <- sucursales %>% rbind(sucursal)
}

################################################################################


productos <- read_delim("2025-06-02/comercio_1/productos.csv", 
                         delim = "|", escape_double = FALSE, trim_ws = TRUE)

for(i in c(2:6)){
  print(i)
  producto <- read_delim(paste0("2025-06-02/comercio_",i,"/productos.csv"), delim = "|", escape_double = FALSE, trim_ws = TRUE)
  print(nrow(producto))
  productos <- productos %>% rbind(producto)
}

################################################################################


sucursales <- sucursales %>% merge(comercios, by = c("id_comercio", "id_bandera"))
sucursales <- sucursales %>% select(id_comercio, id_bandera, id_sucursal, sucursales_tipo, sucursales_calle, sucursales_numero, sucursales_latitud, sucursales_longitud, sucursales_provincia, comercio_bandera_nombre, comercio_bandera_url)


productos <- productos %>% merge(sucursales, by = c("id_comercio", "id_bandera", "id_sucursal"))

productos <- productos %>% filter(sucursales_provincia == "AR-C")

cien_productos <- productos %>% group_by(id_producto) %>% summarise(cantidad = n()) %>% arrange(desc(cantidad))
cien_productos <- cien_productos[c(1:100),]

productos <- productos %>% filter(id_producto %in% cien_productos$id_producto) 

write.csv(productos, "productos_final.csv", row.names = F)