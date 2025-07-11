import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const setupFirebaseAdmin = (configService: ConfigService) => {
  const firebaseConfig = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }
  return admin;
};