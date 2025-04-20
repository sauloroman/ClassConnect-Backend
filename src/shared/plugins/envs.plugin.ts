import 'dotenv/config'
import * as env from 'env-var'

export const envs = {

  PORT: env.get('PORT').required().asPortNumber(),
  
  POSTGRESDB_USER: env.get('POSTGRESDB_USER').required().asString(),
  POSTGRESDB_PASSWORD: env.get('POSTGRESDB_PASSWORD').required().asString(),
  POSTGRESDB_NAME: env.get('POSTGRESDB_NAME').required().asString(),
  POSTGRES_URL: env.get('POSTGRES_URL').required().asUrlString(),

  MAILER_SERVICE: env.get('MAILER_SERVICE'). required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL'). required().asString(),
  SEND_EMAIL: env.get('SEND_EMAIL'). required().asBool(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY'). required().asString(),

  VERIFICATION_CODE_DURATION: env.get('VERIFICATION_CODE_DURATION').required().asIntPositive(),

  JWT_SEED: env.get('JWT_SEED').required().asString(),

}