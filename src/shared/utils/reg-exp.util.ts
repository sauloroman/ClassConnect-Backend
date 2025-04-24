type regularExpType = {
  email: RegExp
  qrCodeID: RegExp,
}

export const regularExp: regularExpType = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  qrCodeID:  /\/([^\/]+)\.(?:png|jpg|jpeg|webp|gif|svg)$/i
}