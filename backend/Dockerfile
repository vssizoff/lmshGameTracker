FROM oven/bun:canary

WORKDIR /app

COPY . .

RUN bun i
RUN bun run build

#CMD ["node", "./dist/main.js"]
CMD ["bun", "./dist/main.js"]
