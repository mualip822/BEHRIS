import "dotenv/config";

import app from "./app";
import db from "./config/db";

// =====================================
// GOOGLE CLIENT ID
// =====================================
console.log("GOOGLE CLIENT ID:");
console.log(process.env.GOOGLE_CLIENT_ID);

// =====================================
// PORT
// =====================================
const PORT = Number(process.env.PORT) || 3000;

// =====================================
// DATABASE
// =====================================
db.connect()
  .then(() => {
    console.log("Database connected ✅");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Error ❌", err);
  });