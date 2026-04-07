import express from "express";
import cors from "cors";
import db from "./config/new-database.js";
import ubicacionRoutes from "./routes/ubicacionRoutes.js";
import componenteRoutes from "./routes/componenteRoutes.js";
import tiposComponenteRoutes from "./routes/tiposComponenteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/ubicaciones", ubicacionRoutes);
app.use("/api/componentes", componenteRoutes);
app.use("/api/tipos-componentes", tiposComponenteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Servidor del Buscador de Inventario funcionando 🚀 en Render!");
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
