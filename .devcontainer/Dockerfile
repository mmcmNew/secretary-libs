FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Установка дополнительных пакетов
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git

# Установка глобальных npm пакетов
RUN npm install -g create-vite

USER node