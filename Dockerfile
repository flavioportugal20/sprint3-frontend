# Define a imagem base
FROM httpd:2.4

# Copia os arquivos de requisitos para o diretório de trabalho
COPY . /usr/local/apache2/htdocs/

#informa a porta que deverá ser liberada na criação do container
EXPOSE 80
