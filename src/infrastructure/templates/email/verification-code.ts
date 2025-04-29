import { envs } from "../../../shared/plugins";

export const verificationCodeEmailTemplate = (code: string, token: string ): string => {

  const { FRONTEND_URL } = envs

  const htmlBody = `
    <!DOCTYPE html>
    <html style="font-size: 62.5%;" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ClassConnect &mdash; Valida tu cuenta</title>
    </head>
    <body style="font-size: 1.2rem; line-height: 1.5;">
      <section 
        style="
          background-color: #f5f5f5;
          font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
          width: 60rem;
          max-width: 85%;
          margin: 0 auto;
          box-shadow: 0 5px 5px 2px rgba(0, 0, 0, .25);
          border-radius: 10px;
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #142027;
            color: #fff;
            padding: 0 1rem;
          "
        >
          <h1 style="font-size: 2rem;">Verifica tu cuenta! 📮</h1>
          <img 
            src="https://res.cloudinary.com/dlamufioy/image/upload/v1745175170/classconnect/logo-background-black_qxdbrh.png" 
            alt="ClassConnect Background Black"
            style="
              display: inline-block;
              height: 5rem;
            "
          >
        </div>
        <div style="padding: 1rem;">
          <p>Gracias por registrarte 👋. Para completar el proceso, introduce el siguiente código de verificación:</p>
          <div style="text-align: center; margin: 2rem 0 3rem; color: #142027;">
            <p style="font-size: 2rem; letter-spacing: 1.2px; font-weight: bold;">${code}</p>
            <a 
              style="
                text-decoration: none; 
                border-radius: 5px; 
                padding: .5rem 2rem; 
                display: inline-block; 
                color: #fff; 
                background-color: #84cf13; 
                margin-top: -1rem;
              " 
              href="${FRONTEND_URL}/auth/validate-account/${token}">Ingresar código</a>
          </div>
          <p>Este código expirará en <span style="font-weight: 700; margin-bottom: 2px; border-bottom: 2px solid currentColor;">10 minutos</span></p>
          <p style="margin-top: -1rem;">Si no has solicitado este correo, simplemente ignóralo.</p>
          <div style="margin-top: 2rem; border-top: 2px solid #ddd; display: flex; flex-direction: column; align-items: center;">
            <p style="font-size: 1rem;">@2025 ClassConnect. Todos los derechos reservados.</p>
            <p style="margin-top: -1rem; font-size: 1rem;">Tel. +52 (449)6548073 | sauloromannava1998@gmail.com</p>
          </div>
        </div>
      </section>
    </body>
    </html>
  `;

  return htmlBody;
};
