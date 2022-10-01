import { IUser } from "models/User";

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
      S3_BUCKET_NAME: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;  
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

export {};
