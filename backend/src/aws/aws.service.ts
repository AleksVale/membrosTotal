import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

  createPhotoKeyPayment(userId: number, paymentId: number, mimeType: string) {
    console.log(mimeType);
    return `payments/${userId}/${paymentId}/payment.${mimeType}`;
  }
}
