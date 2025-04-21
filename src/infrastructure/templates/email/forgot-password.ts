import { envs } from "../../../shared/plugins";

export const forgotPasswordEmailTemplate = (token: string): string => {

  const { FRONTEND_URL } = envs
  const url = `${FRONTEND_URL}auth/${token}`

  const htmlBody = `  
      <!DOCTYPE html>
      <html style="font-size: 62.5%;" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ClassConnect &mdash; Recupera tu contraseña</title>
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
            <h1 style="font-size: 2rem;">Recupera tu contraseña 🔍</h1>
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
            <div style="text-align: left; margin: 2rem 0 3rem; color: #142027;">
              <p style="margin-bottom: 3rem;">Hemos recibido una solicitud para recuperar tu contraseña para este correo electrónico 🧐. Presiona el siguiente botón para crear una nueva contraseña.</p>
              <div style="text-align: center;">
                <a 
                  style="
                    text-decoration: none; 
                    border-radius: 5px; 
                    padding: .5rem 2rem; 
                    display: inline-block; 
                    color: #fff; 
                    background-color: #84cf13; 
                    margin-top: -1rem;" 
                  href="${url}"
                >Crear nueva contraseña</a>
              </div>
            </div>
            <p>Si no puedes navegar, presiona el siguiente link: <a href="${url}" style="font-weight: 700; margin-bottom: 2px; border-bottom: 2px solid currentColor; text-decoration: none;">Quiero recuperar mi contraseña</a></p>
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

  return htmlBody
};
