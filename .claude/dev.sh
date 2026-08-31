#!/bin/sh
# Node je nainštalovaný lokálne v ~/.local/node a nie je v systémovom PATH,
# preto ho doplníme pred spustením dev servera.
export PATH="$HOME/.local/node/bin:$PATH"
exec npm run dev
