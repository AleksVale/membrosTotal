export class UpdateSubModuleDto {
  title?: string;
  description?: string;
  order?: number;

  constructor(data: {
    title?: string;
    description?: string;
    order?: number;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
  }
}
