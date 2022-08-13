declare module 'xss-clean';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      API_PREFIX: string;
      CLIENT_PORT: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      HEROKU?: string;
      PORT?: string;
    }
  }
}

export {};
