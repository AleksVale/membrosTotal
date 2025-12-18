export class Training {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly slug: string,
    public readonly imageUrl: string | null,
    public readonly published: boolean,
    public readonly price: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPublished(): boolean {
    return this.published;
  }

  isFree(): boolean {
    return this.price === 0;
  }

  publish(): Training {
    return new Training(
      this.id,
      this.title,
      this.description,
      this.slug,
      this.imageUrl,
      true,
      this.price,
      this.createdAt,
      new Date(),
    );
  }

  unpublish(): Training {
    return new Training(
      this.id,
      this.title,
      this.description,
      this.slug,
      this.imageUrl,
      false,
      this.price,
      this.createdAt,
      new Date(),
    );
  }

  update(updates: Partial<Pick<Training, 'title' | 'description' | 'imageUrl' | 'price'>>): Training {
    return new Training(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      this.slug,
      updates.imageUrl ?? this.imageUrl,
      this.published,
      updates.price ?? this.price,
      this.createdAt,
      new Date(),
    );
  }
}
