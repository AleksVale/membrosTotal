export class UpdateProfileDto {
  name?: string;
  image?: string | null;

  constructor(data: { name?: string; image?: string | null }) {
    this.name = data.name;
    this.image = data.image;
  }

  hasUpdates(): boolean {
    return this.name !== undefined || this.image !== undefined;
  }

  getDefinedFields(): Partial<{ name: string; image: string | null }> {
    const fields: Partial<{ name: string; image: string | null }> = {};
    if (this.name !== undefined) {
      fields.name = this.name;
    }
    if (this.image !== undefined) {
      fields.image = this.image;
    }
    return fields;
  }
}
