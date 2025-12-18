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
    public readonly isFree: boolean,
    public readonly subModuleId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  hasVideo(): boolean {
    return this.videoUrl !== null && this.videoUrl.length > 0;
  }

  isFreeLesson(): boolean {
    return this.isFree;
  }

  getDurationInMinutes(): number {
    return Math.floor(this.duration / 60);
  }

  update(updates: Partial<Pick<Lesson, 'title' | 'description' | 'order' | 'videoUrl' | 'duration' | 'isFree'>>): Lesson {
    return new Lesson(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.order ?? this.order,
      updates.videoUrl ?? this.videoUrl,
      this.videoProvider,
      updates.duration ?? this.duration,
      updates.isFree ?? this.isFree,
      this.subModuleId,
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
      this.isFree,
      this.subModuleId,
      this.createdAt,
      new Date(),
    );
  }
}
