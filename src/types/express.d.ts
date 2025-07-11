import { Request } from 'express'; 
import * as admin from 'firebase-admin';

declare module 'express' {
  interface Request {
    user?: admin.auth.DecodedIdToken; 
  }
}