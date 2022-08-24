import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

interface CorsOptions {

  origin?: CustomOrigin | undefined;
  methods?: string | string[] | undefined;
  allowedHeaders?: string | string[] | undefined;
  exposedHeaders?: string | string[] | undefined;
  credentials?: boolean | undefined;
  maxAge?: number | undefined;
  preflightContinue?: boolean | undefined;
  optionsSuccessStatus?: number | undefined;
}

const whiteList = [
  "http://localhost",
  "127.0.0.1"
];

export const corsConfig: CorsOptions = {

  origin(origin: string, callback: any) {

    if(origin && whiteList.indexOf(origin) !== -1) {
      console.log(`Allowed for: ${origin}`)
      callback(null, true);
    }
    else {
      console.log(`Blocked for: ${origin !== undefined ? origin : 'unknow'}`);
      callback(new HttpException({
        msg: "Not allowed by CORS", 
        error: "Forbidden"
      }, HttpStatus.FORBIDDEN));
    }
  },
  allowedHeaders: "*",
  methods: "GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS",
  credentials: true,
};