import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export const createConnection = async () => {
  if (!pool) {
    const config = {
      server: process.env.DB_SERVER || "localhost",
      user: process.env.DB_USER || "sa",
      password: process.env.DB_PASSWORD || "30214087695",
      database: process.env.DB_DATABASE || "NextCrudDB",
      options: {
        encrypt: false, // Set true if using Azure
        trustServerCertificate: true, // For local dev
      },
      // port: parseInt(process.env.DB_PORT || "1433"), // Uncomment if using custom port
    };

    pool = await sql.connect(config);
  }

  return pool;
};
