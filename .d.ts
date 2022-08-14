declare module 'xss-clean';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      API_PREFIX: string;
      CLIENT_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      PORT?: string;
    }
  }
}

export {};
