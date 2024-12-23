document.getElementById('authBtn').addEventListener('click', async function () {
    if (!window.PublicKeyCredential) {
      document.getElementById('message').textContent =
        'Este dispositivo o navegador no soporta autenticación con huella.';
      return;
    }
  
    try {
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32), // Genera un desafío
        timeout: 60000,
        allowCredentials: [],
        userVerification: 'required',
      };
  
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });
  
      if (credential) {
        document.getElementById('message').textContent =
          'Autenticación con huella completada con éxito.';
      }
    } catch (error) {
      document.getElementById('message').textContent =
        'Error al autenticar: ' + error.message;
    }
  });
  