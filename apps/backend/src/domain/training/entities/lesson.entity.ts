import { VideoProvider } from '../value-objects/video-provider.vo';

export class Lesson {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly order: number,
    public readonly videoUrl: string | null,
    public readonly videoProvider: VideoProvider,
    public readonly duration: number,
    public readonly subModuleId: string,
    public readonly deletedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  hasVideo(): boolean {
    return this.videoUrl !== null && this.videoUrl.length > 0;
  }

  getDurationInMinutes(): number {
    return Math.floor(this.duration / 60);
  }

  update(
    updates: Partial<
      Pick<Lesson, 'title' | 'description' | 'order' | 'videoUrl' | 'duration'>
    >,
  ): Lesson {
    return new Lesson(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.order ?? this.order,
      updates.videoUrl ?? this.videoUrl,
      this.videoProvider,
      updates.duration ?? this.duration,
      this.subModuleId,
      this.deletedAt,
      this.createdAt,
      new Date(),
    );
  }

  updateVideoProvider(provider: VideoProvider): Lesson {
    return new Lesson(
      this.id,
      this.title,
      this.description,
      this.order,
      this.videoUrl,
      provider,
      this.duration,
      this.subModuleId,
      this.deletedAt,
      this.createdAt,
      new Date(),
    );
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
