import express, { Router } from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'

interface ServerOptions {
  port: number;
  router: Router;
  publicPath?: string;
}

export class Server {

  public readonly app = express()
  private readonly port: number;
  private readonly router: Router;
  private readonly publicPath?: string;
  private serverListener?: any;

  constructor({port, router, publicPath = 'public'}: ServerOptions) {
    this.port = port
    this.router = router
    this.publicPath = publicPath
  }

  public async start() {

    this.app.use( fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }))

    this.app.use( cors() )
    this.app.use( express.json() )
    this.app.use( express.static( this.publicPath! ) )
    this.app.use( express.urlencoded({extended: true}))

    this.app.use( this.router )

    this.serverListener = this.app.listen( this.port, () => {
      console.log(`Server running in port ${this.port}`)
    })

  }

  public close() {
    this.serverListener?.close()
  }

}