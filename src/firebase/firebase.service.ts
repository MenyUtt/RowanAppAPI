import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Evitar inicializar dos veces si el módulo se recarga
    if (!admin.apps.length) {
      // Opción A: Usar el archivo JSON (Recomendado para desarrollo)
      const serviceAccount = require('../../firebase-service-account.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      console.log('🔥 Firebase Admin Inicializado');
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    if (!token) return; // Si el usuario no tiene token, no hacemos nada

    try {
      await admin.messaging().send({
        token: token,
        notification: {
          title: title,
          body: body,
        },
        data: {
          // Convertimos la data a strings porque FCM solo acepta strings en 'data'
          ...Object.keys(data || {}).reduce((acc, key) => {
            acc[key] = String(data[key]);
            return acc;
          }, {}),
          click_action: 'FLUTTER_NOTIFICATION_CLICK', // O lo que use Ionic
        },
      });
      console.log(`✅ Notificación enviada a token: ${token.substring(0, 10)}...`);
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
      // Si el token es inválido (el usuario desinstaló la app), podrías borrarlo de la BD aquí
    }
  }
}