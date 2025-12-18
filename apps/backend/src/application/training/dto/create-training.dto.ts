export class ModuleDto {
  title: string;
  description?: string;
  order: number;
  subModules: SubModuleDto[];

  constructor(data: {
    title: string;
    description?: string;
    order: number;
    subModules: SubModuleDto[];
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.subModules = data.subModules;
  }
}

export class SubModuleDto {
  title: string;
  description?: string;
  order: number;
  lessons: LessonDto[];

  constructor(data: {
    title: string;
    description?: string;
    order: number;
    lessons: LessonDto[];
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.lessons = data.lessons;
  }
}

export class LessonDto {
  title: string;
  description?: string;
  order: number;
  videoUrl?: string;
  videoProvider?: string;
  duration?: number;

  constructor(data: {
    title: string;
    description?: string;
    order: number;
    videoUrl?: string;
    videoProvider?: string;
    duration?: number;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.videoUrl = data.videoUrl;
    this.videoProvider = data.videoProvider;
    this.duration = data.duration;
  }
}

export class CreateTrainingDto {
  title: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  published?: boolean;
  order?: number;
  modules: ModuleDto[];

  constructor(data: {
    title: string;
    description?: string;
    slug: string;
    imageUrl?: string;
    published?: boolean;
    order?: number;
    modules: ModuleDto[];
  }) {
    this.title = data.title;
    this.description = data.description;
    this.slug = data.slug;
    this.imageUrl = data.imageUrl;
    this.published = data.published ?? false;
    this.order = data.order ?? 0;
    this.modules = data.modules;
  }
}
