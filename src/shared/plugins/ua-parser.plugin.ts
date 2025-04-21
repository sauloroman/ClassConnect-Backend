import { Request } from 'express'
import { UAParser } from 'ua-parser-js'

export const uaParserAdapter = {

  getParserInfoUA: ( req: Request ) => {

    const { browser, os, device } = UAParser(req.headers['user-agent'])
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const browserName = browser.name || 'Desconocido'
    const osName = os.name || 'Desconocido'
    const deviceModel = device.model || 'Desconocido'

    return {
      ip, browserName, osName, deviceModel
    }
    
  }

}