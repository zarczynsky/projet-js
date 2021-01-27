module.exports = {
    jwtSecret: 'N9LyZKbgKxUykbY7aZFHthMWUMA8QNTJSWEeazhF',
    cookiesSecret: 'GUQVZ9dQSppShxrTVrfLYUjxeqpdKTKhNKwkQT2f',
    cookiesOptions: {
        secure: process.env.NODE_ENV === 'production',           // Wysyłane tylko po HTTPS (wylaczyc dla deweloperki)
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',    // Wysylane tylko do tej samej domeny (wyłaczyc dla deweloperki)
        maxAge: 1000 * 60 * 60 * 24,                                  // Czas przechowywania przez przegladarke (15 minut)
        httpOnly: true,                                          // Bez dostepu przez JS
        signed: false,                                            // Podpisane w celu weryfikacji
    }
}