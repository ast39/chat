# Этап сборки
FROM node:18.17-alpine AS builder

# Установка необходимых инструментов
RUN apk add --no-cache make gcc g++ python3

# Создание рабочей директории
WORKDIR /app

COPY . .

# Установка глобального CLI NestJS и локальных зависимостей
RUN npm install -g npm@latest
RUN npm install

# Генерация Prisma клиентских файлов
RUN npx prisma generate

# Сборка приложения
RUN npm run build
# Этап выполнения
FROM node:18.16-alpine

# Создание рабочей директории
WORKDIR /app

# Копирование необходимых файлов из этапа сборки
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/*.json ./
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/dist/ ./tmp-dist
COPY --from=builder /app/prisma/ ./prisma

# Команда для запуска приложения
ENTRYPOINT ["node", "./dist/src/main.js"]
