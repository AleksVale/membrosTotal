import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  bucketName: string = this.configService.get('BUCKET');
  s3 = new S3Client({
    region: 'auto',
    endpoint:
      'https://dd17476fdbcb9b0de068fc9fb29b4a5d.r2.cloudflarestorage.com/membros',
    credentials: {
      accessKeyId: this.configService.get('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
    },
  });
  async updatePhoto(photo: Express.Multer.File, photoKey: string) {
    const uploadResult = await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: photoKey,
        Body: photo.buffer,
      }),
    );
    return uploadResult;
  }

  createPhotoKeyPayment(
    userId: number,
    paymentId: number,
    mimeType: string,
    type: 'base' | 'finish' = 'base',
  ) {
    return `payments/${userId}/${paymentId}/${type === 'base' ? 'payment' : 'comprovante'}.${mimeType}`;
  }

  createPhotoKeyTraining(trainingId: number, mimeType: string) {
    return `trainings/${trainingId}/thumbnail.${mimeType}`;
  }

  createPhotoKeyModule(moduleId: number, mimeType: string) {
    return `modules/${moduleId}/thumbnail.${mimeType}`;
  }

  createPhotoKeySubModule(subModuleId: number, mimeType: string) {
    return `subModules/${subModuleId}/thumbnail.${mimeType}`;
  }

  createPhotoKeyLesson(lessonId: number, mimeType: string) {
    return `lessons/${lessonId}/thumbnail.${mimeType}`;
  }

  createPhotoKeyPaymentRequest(
    userId: number,
    paymentRequestId: number,
    mimeType: string,
    type: 'base' | 'finish' = 'base',
  ) {
    return `payment_requests/${userId}/${paymentRequestId}/${type === 'base' ? 'payment_request' : 'comprovante'}.${mimeType}`;
  }

  createPhotoKeyRefunds(
    userId: number,
    paymentRequestId: number,
    mimeType: string,
    type: 'base' | 'finish' = 'base',
  ) {
    return `refunds/${userId}/${paymentRequestId}/${type === 'base' ? 'refund' : 'Comprovante-de-reembolso'}.${mimeType}`;
  }

  createPhotoKeyUser(userId: number, mimeType: string) {
    return `users/${userId}/profile/picture.${mimeType}`;
  }

  async getStoredObject(photoKey: string) {
    const uploadResult = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: photoKey,
      }),
      { expiresIn: 3600 },
    );
    return uploadResult;
  }
}
