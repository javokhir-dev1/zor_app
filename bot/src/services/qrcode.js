/**
 * QR-kod generatsiya xizmati
 *
 * Chipta (ticket) uchun QR-kod rasm sifatida yaratadi.
 * Guard skanerlash uchun UUID qr_code qiymatini QR-kodga aylantiradi.
 */
const QRCode = require('qrcode');

/**
 * QR-kodni Buffer (PNG rasm) sifatida yaratish
 * @param {string} data - QR-kodga yoziladigan ma'lumot (ticket UUID)
 * @returns {Promise<Buffer>} PNG rasm buffer
 */
async function generateQRCode(data) {
  try {
    const buffer = await QRCode.toBuffer(data, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return buffer;
  } catch (error) {
    console.error('[QR] Generatsiya xatoligi:', error.message);
    throw error;
  }
}

/**
 * QR-kodni Data URL sifatida yaratish (web uchun)
 * @param {string} data - QR-kodga yoziladigan ma'lumot
 * @returns {Promise<string>} Data URL string
 */
async function generateQRCodeDataURL(data) {
  try {
    return await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H',
    });
  } catch (error) {
    console.error('[QR] DataURL xatoligi:', error.message);
    throw error;
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeDataURL,
};
