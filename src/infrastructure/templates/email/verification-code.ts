import fs from 'fs'
import path from 'path'

export const verificationCodeEmailTemplate = ( code: string ): string => {

  const cssPath = path.join( __dirname, 'email-template.css' )
  const styles = fs.readFileSync( cssPath, 'utf-8' )

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ClassConnect &mdash; Valida tu cuenta</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <header class="header">
          <h1 class="heading">Verifica tu cuenta! 📮</h1>
          <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1745175170/classconnect/logo-background-black_qxdbrh.png" class="logo" alt="ClassConnect Background Black">
        </header>
        <div class="content">
          <p class="thanks">Gracias por registrarte 👋. Para completar el proceso, introduce el siguiente código de verificación:</p>
          <div class="code-box">
            <strong class="code">${code}</strong>
          </div>
          <p class="time">Este código expirará en <span>10 minutos</span></p>
          <p class="ad">Si no has solicitado este correo, simplemente ignóralo.</p>
          <footer class="footer">
            <p>@2025 ClassConnect. Todos los derechos reservados.</p>
            <p>Tel. +52 (449)6548073 | sauloromannava1998@gmail.com</p>
          </footer>
        </div>
      </div>
    </body>
    </html>
  `

  return htmlBody
}