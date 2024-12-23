function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

function marcarAsistencia(email, latActual, lngActual) {
  var ss = SpreadsheetApp.openById('TU_SPREADSHEET_ID'); // Reemplaza con el ID
  var hojaAsistencia = ss.getSheetByName('Asistencia');
  var hoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  var data = hojaAsistencia.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] == email) {
      var latEsperada = parseFloat(data[i][2]); // LATITUD esperada (col C)
      var lngEsperada = parseFloat(data[i][3]); // LONGITUD esperada (col D)
      var fechaUltimoRegistro = data[i][10]; // FECHA ÚLTIMO REGISTRO (col K)

      if (fechaUltimoRegistro == hoy) {
        return "Ya registraste tu asistencia hoy. Intenta nuevamente mañana.";
      }

      var distancia = calcularDistancia(latActual, lngActual, latEsperada, lngEsperada);
      var ahora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

      if (distancia < 0.05) {
        hojaAsistencia.getRange(i + 1, 5).setValue('Sí');         // Col E: ASISTIÓ
        hojaAsistencia.getRange(i + 1, 6).setValue('Escaneado');  // Col F: NOTIFICACIÓN
        hojaAsistencia.getRange(i + 1, 7).setValue('Correcto');   // Col G: RESULTADO
        hojaAsistencia.getRange(i + 1, 8).setValue(ahora);        // Col H: FECHA/HORA
        hojaAsistencia.getRange(i + 1, 11).setValue(hoy);         // Col K: FECHA ÚLTIMO REGISTRO
        return "Asistencia registrada con éxito para " + data[i][0];
      } else {
        return "Ubicación incorrecta. No se puede registrar la asistencia.";
      }
    }
  }

  return "No se encontró un profesor asociado a este correo.";
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radio de la Tierra en km
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = 0.5 - Math.cos(dLat) / 2 +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          (1 - Math.cos(dLon)) / 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
