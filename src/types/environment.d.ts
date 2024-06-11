declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_CONNECTION: string
      DB_HOST: string
      DB_PORT: string
      DB_DATABASE: string
      DB_USERNAME: string
      DB_PASSWORD: string

      JWT_SECRET: string
      ACCESS_TOKEN_EXPIRATION: string
      REFRESH_TOKEN_EXPIRATION: string

      DB_MONGO: string
    }
  }
}

export {}
