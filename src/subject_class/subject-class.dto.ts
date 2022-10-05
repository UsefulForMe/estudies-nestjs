export interface CreateSubjectClassReq {
  subjectId: string;
  teacherId: string;
  startAt?: Date;
  endAt?: Date;
}

export interface UpdateSubjectClassReq {
  teacherId?: string;
  name?: string;
  startAt?: Date;
  endAt?: Date;
}
