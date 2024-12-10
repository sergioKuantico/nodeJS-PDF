const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const axios = require("axios");
const cors = require("cors");

const app = express();
// Configurar CORS
app.use(
  cors({
    origin: "*", // Permitir todas las solicitudes de cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
  })
);

app.use(express.json());

const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Servir archivos estáticos desde el directorio "public"
app.use("/static", express.static(publicDir));

app.get("/", (req, res) => {
  res.send("It's Working");
});

// Cargar imágenes locales
app.post("/load-local-images", async (req, res) => {
  const { images } = req.body;

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "El cuerpo debe incluir un arreglo de URLs de imágenes.",
    });
  }

  try {
    const fetchImagePromises = images.map(async (imageUrl) => {
      try {
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 5000, // Configura un timeout de 5 segundos
        });

        // Convertir la imagen a base64
        const imageBuffer = Buffer.from(response.data, "binary");
        const base64Image = imageBuffer.toString("base64");
        return {
          url: imageUrl,
          base64: `data:${response.headers["content-type"]};base64,${base64Image}`,
        };
      } catch (err) {
        // Retorna error por URL fallida
        return {
          url: imageUrl,
          error: `No se pudo descargar la imagen: ${err.message}`,
        };
      }
    });

    const results = await Promise.all(fetchImagePromises);

    // Separa resultados exitosos y fallidos
    const successful = results.filter((r) => !r.error);
    const failed = results.filter((r) => r.error);

    res.json({
      success: true,
      images: successful,
      errors: failed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocurrió un error procesando las imágenes.",
    });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
