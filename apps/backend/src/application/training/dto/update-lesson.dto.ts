export class UpdateLessonDto {
  title?: string;
  description?: string;
  order?: number;
  videoUrl?: string;
  videoProvider?: string;
  duration?: number;

  constructor(data: {
    title?: string;
    description?: string;
    order?: number;
    videoUrl?: string;
    videoProvider?: string;
    duration?: number;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.videoUrl = data.videoUrl;
    this.videoProvider = data.videoProvider;
    this.duration = data.duration;
  }
}
