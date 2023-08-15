import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps()?.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
  }
  initializeApp({
    credential: cert(
      // 環境変数から認証情報を取得
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
    ),
  });
}

export const adminDB = getFirestore();
