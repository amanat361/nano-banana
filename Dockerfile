FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY . .

RUN bun install

ENV PORT=7429
EXPOSE 7429

CMD ["bun", "src/index.tsx"]