export class SubModule {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly order: number,
    public readonly moduleId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  update(updates: Partial<Pick<SubModule, 'title' | 'description' | 'order'>>): SubModule {
    return new SubModule(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.order ?? this.order,
      this.moduleId,
      this.createdAt,
      new Date(),
    );
  }
}
