export class LessonResponseDto {
  id: string;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  videoProvider: string;
  duration: number;
  isFree: boolean;
  subModuleId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    videoUrl: string | null;
    videoProvider: string;
    duration: number;
    isFree: boolean;
    subModuleId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.videoUrl = data.videoUrl;
    this.videoProvider = data.videoProvider;
    this.duration = data.duration;
    this.isFree = data.isFree;
    this.subModuleId = data.subModuleId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class SubModuleResponseDto {
  id: string;
  title: string;
  description: string | null;
  order: number;
  moduleId: string;
  lessons: LessonResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    moduleId: string;
    lessons: LessonResponseDto[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.moduleId = data.moduleId;
    this.lessons = data.lessons;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class ModuleResponseDto {
  id: string;
  title: string;
  description: string | null;
  order: number;
  trainingId: string;
  subModules: SubModuleResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    trainingId: string;
    subModules: SubModuleResponseDto[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.trainingId = data.trainingId;
    this.subModules = data.subModules;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class TrainingResponseDto {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  imageUrl: string | null;
  published: boolean;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  modules?: ModuleResponseDto[];

  constructor(data: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    imageUrl: string | null;
    published: boolean;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    modules?: ModuleResponseDto[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.slug = data.slug;
    this.imageUrl = data.imageUrl;
    this.published = data.published;
    this.price = data.price;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.modules = data.modules;
  }
}
