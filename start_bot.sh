#!/usr/bin/env bash
# start_bot.sh — inicia o bot WhatsApp e mostra logs no terminal

cd /home/yasbot/Desktop/yasbot || exit 1

# inicia o bot (exibe os logs em tempo real)
yarn start:prod
