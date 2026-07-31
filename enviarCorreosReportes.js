/**
 * Envía los correos electrónicos a los ejecutivos con los enlaces de sus reportes.
 *
 * Regla de Negocio: Si el archivo del reporte ya existía en Drive, no se genera un nuevo urlArchivo.
 * En este caso, no es necesario enviar el correo electrónico, por lo que la función lo omite de forma segura.
 *
 * @param {Array<Object>} paquetes Lista de paquetes de reportes de renovaciones a procesar.
 */
function enviarCorreosReportes(paquetes) {
  paquetes.forEach(paquete => {
    // REGLA 1: Si no hay correos configurados, saltamos
    if (!paquete.emails || paquete.emails.trim() === '') return;

    // REGLA 2 (¡NUEVA!): Si no hay URL (porque el archivo se omitió al ya existir), saltamos
    // Esto evita enviar correos con enlaces rotos o notificaciones innecesarias cuando el archivo ya existe.
    if (!paquete.urlArchivo) {
      console.log(`🚫 Correo omitido para ${paquete.nombre}: No se generó un nuevo archivo (ya existía).`);
      return;
    }

    const anioRenovacion = paquete.fechaBase.getFullYear() + 1;
    const mesStr = formatearMes(paquete.fechaBase);
    const asunto = `Nuevas Renovaciones: ${paquete.nombre} - ${mesStr} ${anioRenovacion}`;

    // Armamos un correo bonito en HTML
    const cuerpoHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2e6c80;">Hola, equipo de ${paquete.nombre}</h2>
        <p>El reporte de renovaciones para <b>${mesStr} ${anioRenovacion}</b> ya está listo y procesado en el sistema.</p>
        <p>Se procesaron un total de <b>${paquete.datos.length}</b> pólizas.</p>
        <br>
        <a href="${paquete.urlArchivo}" style="padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Abrir Reporte en Google Sheets</a>
        <br><br>
        <p><i>Nota: Las filas marcadas en magenta tienen recibos pendientes en Cobranzapp.</i></p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #888;">Mensaje generado automáticamente por Bot RenovApp 🤖</p>
      </div>
    `;

    MailApp.sendEmail({
      to: paquete.emails,
      subject: asunto,
      htmlBody: cuerpoHtml
    });

    console.log(`📧 Correo enviado a: ${paquete.emails}`);
  });
}
