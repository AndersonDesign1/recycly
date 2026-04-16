import app from "./index";

const { env } = app.decorator;

app.listen({
  hostname: env.API_HOST,
  port: env.API_PORT,
});

console.log(`Recycly API listening on http://${env.API_HOST}:${env.API_PORT}`);
