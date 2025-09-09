FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY . .

RUN bun install

# Build the application (creates static assets in dist/)
RUN bun run build

ENV PORT=7429
EXPOSE 7429

# Use the production start command
CMD ["bun", "run", "start"]