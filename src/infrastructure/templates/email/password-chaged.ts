import { envs } from "../../../shared/plugins";

export const passwordChangedTemplate = () => {

  const { FRONTEND_URL } = envs
  const url = `${FRONTEND_URL}auth/login`

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
          width: 50rem;
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
          <h1 style="font-size: 1.8rem;">Contraseña Actualizada 💥</h1>
          <img 
            src="https://res.cloudinary.com/dlamufioy/image/upload/v1745175170/classconnect/logo-background-black_qxdbrh.png" 
            alt="ClassConnect Background Black"
            style="
              display: inline-block;
              height: 5rem;
            "
          >
        </div>
          <div style="text-align: left; color: #142027; padding: 1rem;">
            <p>La contraseña asociada a este correo en ClassConnect ha sido actualizada correctamente. Ya puedes iniciar sesión, presiona el siguiente botón.</p>
            <div style="margin: 2rem 0; display: flex; justify-content: center;">
              <a style="display: inline-block; background-color: #84cf13; color: #fff; padding: .5rem 1rem; text-decoration: none; font-weight: bold; " href="${url}">Iniciar Sesión</a>
            </div>
            <p>Si tú no has solicitado este cambio de contraseña comunicate al correo: <a href="mailto: sauloromannava1998@gmail.com">sauloromannava1998@gmail.com</a></p>
          </div>
        </div>
        <div style="border-top: 2px solid #ddd; display: flex; flex-direction: column; align-items: center;">
          <p style="font-size: .8rem;">@2025 ClassConnect. Todos los derechos reservados.</p>
          <p style="margin-top: -1rem; font-size: .8rem;">Tel. +52 (449)6548073 | sauloromannava1998@gmail.com</p>
        </div>
      </section>
    </body>
    </html>
  `;

  return htmlBody
};
