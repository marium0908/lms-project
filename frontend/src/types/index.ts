export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  createdAt?: string;
}

export interface Lecture {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt?: string;
}
