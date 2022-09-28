export interface CreateSubjectClassReq {
  subjectId: string;
  teacherId: string;
}

export interface UpdateSubjectClassReq {
  teacherId?: string;
  name?: string;
}
