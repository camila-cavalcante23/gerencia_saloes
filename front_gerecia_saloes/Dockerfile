#
FROM node:22-alpine

# 2. Cria a pasta do site dentro do Docker
WORKDIR /app

# 3. Copia os arquivos de configuração
COPY package*.json ./

# 4. Instala tudo o que o site precisa (React, Ícones, Axios...)
RUN npm install

# 5. Copia o resto do código 
COPY . .

# 6. Libera a porta 5173 
EXPOSE 5173

# 7. O comando final que liga o site e libera acesso externo 
CMD ["npm", "run", "dev", "--", "--host"]