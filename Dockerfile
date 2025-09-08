FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "src/index.tsx"]