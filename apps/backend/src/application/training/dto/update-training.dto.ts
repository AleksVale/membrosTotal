export class UpdateTrainingDto {
  title?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  published?: boolean;
  order?: number;

  constructor(data: {
    title?: string;
    description?: string;
    slug?: string;
    imageUrl?: string;
    published?: boolean;
    order?: number;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.slug = data.slug;
    this.imageUrl = data.imageUrl;
    this.published = data.published;
    this.order = data.order;
  }
}
