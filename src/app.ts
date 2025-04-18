import { RouterApp } from "./presentation/routes/routes"
import { Server } from "./presentation/server-express"
import { envs } from "./shared/plugins"

(async () => {
  await main()
})()

async function main() {

  const server = new Server({
    port: envs.PORT,
    router: RouterApp.routes,
    publicPath: 'public'
  })

  await server.start()
  
}