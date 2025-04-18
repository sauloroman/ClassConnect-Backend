import 'dotenv/config'
import * as env from 'env-var'

export const envs = {

  PORT: env.get('PORT').required().asPortNumber(),
  
  POSTGRESDB_USER: env.get('POSTGRESDB_USER').required().asString(),
  POSTGRESDB_PASSWORD: env.get('POSTGRESDB_PASSWORD').required().asString(),
  POSTGRESDB_NAME: env.get('POSTGRESDB_NAME').required().asString(),
  POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),

}