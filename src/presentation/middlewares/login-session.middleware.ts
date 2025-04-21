import { NextFunction, Request, Response } from "express";
import { uaParserAdapter } from "../../shared/plugins";

export class LoginSessionMiddleware {

  public static sessionLogger( req: Request, res: Response, next: NextFunction ): any {

    const sessionInformation = uaParserAdapter.getParserInfoUA( req )
    const { browserName, deviceModel, ip, osName } = sessionInformation

    console.log(browserName, deviceModel, ip, osName)

    req.body.sessionInfo = {
      ip: typeof ip === 'string' ? ip : 'Unknown',
      browser: browserName,
      device: deviceModel,
      os: osName
    }

    next()
  }

}