(async () => {
  const app = new Backendium({
    name: "inf54",
    version: "0.0.0",
    host: process.env.HOST,
    port: Number(process.env.PORT ?? 8080)
  });

  app.start();
})();
