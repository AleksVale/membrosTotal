export class CreateSubModuleDto {
  title: string;
  description?: string;
  order: number;
  moduleId: string;

  constructor(data: {
    title: string;
    description?: string;
    order: number;
    moduleId: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.moduleId = data.moduleId;
  }
}
