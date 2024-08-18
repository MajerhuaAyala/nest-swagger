# Usa la imagen oficial de PostgreSQL como base
FROM postgres:latest

# Establece las variables de entorno para PostgreSQL
ENV POSTGRES_DB=nest_boilerplate
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Expon el puerto en el que PostgreSQL estará escuchando
EXPOSE 5432

# Añade un comando de inicialización para asegurar que las configuraciones se carguen correctamente
CMD ["postgres"]
