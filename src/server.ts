import "dotenv/config";

import app from "./app";
import db from "./config/db";

// =====================================
// CHECK GOOGLE CLIENT ID
// =====================================
console.log(
  process.env
    .GOOGLE_CLIENT_ID
);

const PORT =
  process.env.PORT || 3000;

// =====================================
// DATABASE CONNECT
// =====================================
db.connect()
  .then(() => {

    console.log(
      "Database connected ✅"
    );

    // =================================
    // START SERVER
    // =================================
    app.listen(PORT, () => {

      console.log(
        `Server running on http://localhost:${PORT}`
      );

    });

  })
  .catch((err) => {

    console.error(
      "DB Error ❌",
      err
    );

  });