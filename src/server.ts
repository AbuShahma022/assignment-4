import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected.");
    app.listen(config.port, () => {
      console.log(`FixItNow Server is running on port ${config.port}`);
    });
  } catch (error) {
    
    console.error("Failed to start server.", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();