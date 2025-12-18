export class Module {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly order: number,
    public readonly trainingId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  update(updates: Partial<Pick<Module, 'title' | 'description' | 'order'>>): Module {
    return new Module(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.order ?? this.order,
      this.trainingId,
      this.createdAt,
      new Date(),
    );
  }
}
