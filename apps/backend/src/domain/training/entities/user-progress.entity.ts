export class UserProgress {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly lessonId: string,
    public readonly isCompleted: boolean,
    public readonly lastWatchedAt: Date,
  ) {}

  markAsCompleted(): UserProgress {
    return new UserProgress(
      this.id,
      this.userId,
      this.lessonId,
      true,
      new Date(),
    );
  }

  markAsIncomplete(): UserProgress {
    return new UserProgress(
      this.id,
      this.userId,
      this.lessonId,
      false,
      new Date(),
    );
  }

  updateLastWatched(): UserProgress {
    return new UserProgress(
      this.id,
      this.userId,
      this.lessonId,
      this.isCompleted,
      new Date(),
    );
  }
}
