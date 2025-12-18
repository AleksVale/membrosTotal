export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly trainingId: string,
    public readonly enrolledAt: Date,
  ) {}

  isRecent(days: number = 7): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.enrolledAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
}
