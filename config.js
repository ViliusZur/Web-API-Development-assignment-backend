// this is info to connect to DB
exports.config = {
  host: process.env.DB_HOST || "remotemysql.com",
  post: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "4adHphA4sQ",
  password: process.env.DB_PASSWORD || "yB7LQPYPiS",
  database: process.env.DB_DATABASE || "4adHphA4sQ",
  connectionLimit: 100
};
