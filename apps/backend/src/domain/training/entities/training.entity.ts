export class Training {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly slug: string,
    public readonly imageUrl: string | null,
    public readonly published: boolean,
    public readonly order: number,
    public readonly deletedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPublished(): boolean {
    return this.published;
  }

  publish(): Training {
    return new Training(
      this.id,
      this.title,
      this.description,
      this.slug,
      this.imageUrl,
      true,
      this.order,
      this.deletedAt,
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
      this.order,
      this.deletedAt,
      this.createdAt,
      new Date(),
    );
  }

  update(updates: Partial<Pick<Training, 'title' | 'description' | 'imageUrl' | 'order' | 'published' | 'slug'>>): Training {
    return new Training(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.slug ?? this.slug,
      updates.imageUrl ?? this.imageUrl,
      updates.published ?? this.published,
      updates.order ?? this.order,
      this.deletedAt,
      this.createdAt,
      new Date(),
    );
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
