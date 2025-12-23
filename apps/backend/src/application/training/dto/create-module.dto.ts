export class CreateModuleDto {
  title: string;
  description?: string;
  order: number;
  trainingId: string;

  constructor(data: {
    title: string;
    description?: string;
    order: number;
    trainingId: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.trainingId = data.trainingId;
  }
}
