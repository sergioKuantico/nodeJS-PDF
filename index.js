const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

// Asegúrate de que el directorio "public" existe
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Servir archivos estáticos desde el directorio "public"
app.use("/static", express.static(publicDir));

app.post("/generate-pdf", async (req, res) => {
  try {
    const { quoteData } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const html = `
      <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDF Content</title>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
    />
    <!-- Estilos CSS -->
    <style>
      .header-pdf {
        border-radius: 10px 10px 0 0;
        background-color: #929294;
        color: #fff;
        padding: 5px;
        font-size: 14px;
        text-align: center;
      }

      body {
        max-width: 800px !important;
        margin: 0px auto;
        font-family: "Montserrat", sans-serif;
      }

      .p-4 {
        border-radius: 10px;
        margin: 0;
      }

      .tt-pdf-h3 {
        color: #fff;
        padding: 5px;
        font-size: 14px;
        text-align: center;
      }

      .container {
        position: relative;
        padding: 30px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
      }

      .col-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }

      .text-left {
        text-align: left !important;
      }

      .d-flex {
        display: flex !important;
      }

      .flex-column {
        flex-direction: column !important;
      }

      .justify-content-between {
        justify-content: space-between !important;
      }

      .mt-4 {
        margin-top: 1.5rem !important;
      }

      .w-50 {
        width: 50% !important;
      }

      .align-self-end {
        align-self: flex-end !important;
      }

      .mr-5 {
        margin-right: 1.25rem !important;
      }

      .float_img {
        position: absolute;
        left: 45%;
        bottom: calc(95% - 10px);
      }

      /* Resto de los estilos CSS */
    </style>
  </head>
  <body style="margin: 0px auto; width: 800px; text-align: center">
    <section style="margin: 20px 0px; text-align: left;">
      <table style="background-color: #303030; color: white; width: 100%">
        <tr>
          <!-- LOGO  -->
          <td style="width: 50%; text-align: left; padding: 10px; padding-left: 40px;">
            <h2 style="margin-top: 0">Proyecto:</h2>
            <h2 style="margin-top: 0">${quoteData.proyectName}</h2>
            <p>N° de cotización: ${quoteData.quateCode}</p>
          </td>
          <!-- LOGO  -->
          <!-- INFO  -->
          <td style="width: 50%; text-align: center">
            <img
              style="border-radius: 10px; width: 50%"
              src="https://besalcoinmobiliaria.cl/pdf/projects/${quoteData.projectId}.png"
              alt=""
            /><br />
            <img
              style="border-radius: 10px; width: 25%; margin-bottom: 15px;"
              src="https://besalcoinmobiliaria.cl/pdf/besalco-blanco.png"
              alt=""
            />
          </td>
          <!-- INFO  -->
        </tr>
      </table>
    </section>
    <!-- ENCABEZADO -->

    <div style="margin: 40px auto; text-align: left;">
      <p style="margin: 40px; text-align: justify">
        Estimado/a: <strong>${quoteData.leadName}</strong>
        <br />
        <br />
        Gracias por cotizar en Besalco Inmobiliaria. Pronto un ejecutivo se contactará con usted, para entregarle mayor información sobre el proyecto en el que está interesado. A continuación detallamos su cotización. 
        <br />
        <br />
        Saluda atentamente, <br />
        Asistente Virtual Web
      </p>

      <img
        src="https://besalcoinmobiliaria.cl/pdf/icons/borde-linea.png"
        alt="border image"
        style="width: 50%; margin-left: 25%"
      />
      <h4
        style="
          color: #454546;
          margin: 20px auto;
          text-align: center;
          font-size: 25px;
        "
      >
        <strong>Resumen de la Cotización</strong>
      </h4>
    </div>

    <!-- Datos del Proyecto -->
   
    <section style="text-align: left; margin-top: 25px;">
      <div
        style="background-color: #eaeaea;"
      >
        <table style="width: 100%; padding: 5px 40px;">
          <tr>
            <td colspan="3" style="padding: 20px">
              <h4 style="color: #929294; font-size: 18px">
                Datos del proyecto
              </h4>
            </td>
          </tr>
          <tr>
            <td style="width: 30%; padding: 10px; border-bottom: 1px solid white;">Proyecto</td>
            <td style="width: 5%; padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="width: 65%; padding: 10px; border-bottom: 1px solid white;">${quoteData.proyectName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;; border-bottom: 1px solid white;">Teléfono</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.eje_phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Correo</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.eje_mail}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Fecha emisión</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.fecha}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Validez</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">10 días desde la fecha de emisión</td>
          </tr>
        </table>
      </div>
    </section>
    <!-- Datos del Proyecto -->
    <!-- Datos del Cotizante -->
 
    <section style="text-align: left; margin-top: 25px;">
      <div
        style="background-color: #eaeaea"
      >
        <table style="width: 100%; padding: 5px 40px;">
          <tr>
            <td colspan="3" style="padding: 20px">
              <h4 style="color: #929294; font-size: 18px">
                Datos del cotizante
              </h4>
            </td>
          </tr>
          <tr>
            <td style="width: 20%; padding: 10px; border-bottom: 1px solid white;">Señor(a)</td>
            <td style="width: 5%; padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="width: 75%; padding: 10px; border-bottom: 1px solid white;">${quoteData.leadName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Teléfono</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.leadPhone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Correo</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">:</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.leadEmail}</td>
          </tr>
        </table>
      </div>
    </section>
    <!-- Datos del Cotizante -->
    <!-- Dividendo -->
   
    <section style="text-align: left; margin-top: 25px;">
      <div
        style="background-color: #eaeaea;"
      >
        <table style="width: 100%; padding: 5px 40px;">
          <tr>
            <td colspan="3" style="padding: 20px">
              <h4 style="color: #929294; font-size: 18px">Simulación</h4>
            </td>
          </tr>
          <tr>
            <td style="width: 33%; padding: 10px; border-bottom: 1px solid white;">Pie (15%)</td>
            <td style="width: 33%; padding: 10px; border-bottom: 1px solid white;">${quoteData.ufPrice15} UF</td>
            <td style="width: 33%; padding: 10px; border-bottom: 1px solid white;">$ ${quoteData.normalPrice15}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Crédito Hipotecario (85%)</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.ufPrice85} UF</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">$ ${quoteData.normalPrice85}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Total</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.ufPrice} UF</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">$ ${quoteData.normalPrice}</td>
          </tr>
        </table>
        <p style="color: #7a7b7c; padding: 40px; margin: 0">
          Esta información es solo referencial
        </p>
      </div>
    </section>
    <!-- Dividendo -->
    <!-- Datos de la propiedad -->
  
    <section style="text-align: left; margin-top: 25px;">
      <div
        style="background-color: #eaeaea;"
      >
        <table style="width: 100%; padding: 5px 40px;">
          <tr>
            <td colspan="2" style="padding: 20px">
              <h4 style="color: #929294; font-size: 18px">
                Datos de la propiedad ${quoteData.unidad}
              </h4>
            </td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 10px; border-bottom: 1px solid white;">Tipología</td>
            <td style="width: 50%; padding: 10px; border-bottom: 1px solid white;">${quoteData.programa}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Orientación</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.orientacion}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Área útil (m2) útil</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.suputil}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Terraza</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.supterra}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Total</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.suptotal}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Precio</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">UF ${quoteData.ufPrice}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Descuento</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">${quoteData.descuento}%</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid white;">Total</td>
            <td style="padding: 10px; border-bottom: 1px solid white;">UF ${quoteData.totalPrice}</td>
          </tr>
        </table>
      </div>
    </section>
    <!-- Datos de la propiedad -->

    <!-- Resumen Cotizacion  -->
    <!-- Resumen Precio -->

    <!-- VISTA PLANTA -->
    <section
      style="background-color: #eaeaea; position: relative; margin: 0px; text-align: left;"
    >
      <h4 style="color: #929294; font-size: 18px; padding: 20px">
        Imagen planta
      </h4>
      <div style="margin-top: -25px">
        <div style="text-align: center">

          <img
            src="${quoteData.procesedImg}"
            width="100%"
            style="margin: 0px auto"
            alt="imagen del modelo"
          />
        </div>
      </div>
    </section>
    <!-- LEGALES  -->
    <section style="text-align: left; margin-top: 25px;" style="width: 800px;">
      <div>
        <div
          class="container my-5 pt-4 pb-4"
          style="background-color: #eaeaea; position: relative"
        >
          <h4 style="color: #929294; font-size: 18px; padding: 20px">
            Notas Legales
          </h4>
          <div>
            <ul style="font-size: 15px; padding-left: 20px">
              <li>
                Cotización válida por 10 días corridos a contar de esta fecha.
                No constituye reserva de compra
              </li>
              <li>
                La propietaria podrá modificar los precios señalados, sin
                expresión de causa, en cualquier momento, hasta antes de la
                aceptación de la oferta de compra.
              </li>
              <li>
                Serán de cargo exclusivo del comprador, todos los gastos que
                sean necesarios para concretar la compra, tales como, gastos
                notariales, de inscripción en Conservador de Bienes Raíces, etc.
                Entre estos gastos se incluye el fondo operacional del
                Condominio, cuyo valor referencial es de UF 15. Los gastos
                anteriores, deberán estar cancelados para proceder a la entrega
                del inmueble.
              </li>
              <li>
                Será de cargo del comprador el costo por concepto de comisión
                más iva , cobrada por Transbank para los pagos con tarjetas
                bancarias.
              </li>
              <li>
                La tasa de interés es sólo referencial, no incluyendo valor de
                seguros.
              </li>
              <li>
                A la firma del contrato de promesa de compraventa, el comprador
                deberá cancelar 20% de pie calculado sobre el precio total de la
                venta.
              </li>
              <li>
                La sup. útil de la edificación se determina conforme se
                establece en los arts. 1.1.2 y 5.1.11 de la OGUC.
              </li>
              <li>
                Horario de atención: lunes a domingo de 10:30 a 14:00 y de 15:00
                a 18:30 horas
              </li>
              <li>
                En caso de dudas y no lograr comunicarse con su ejecutivo, lo
                puede hacer a: ingrid.toro@besalco.cl - Cel. 9 74685189 - Jefa
                de ventas - Ingrid Toro
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- LEGALES  -->
  </body>
</html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generar el PDF dentro del directorio "public"
    const pdfPath = path.join(publicDir, "cotizacion.pdf");
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();

    // Enviar la URL del archivo al cliente
    res.status(200).json({ url: `/static/cotizacion.pdf` });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
