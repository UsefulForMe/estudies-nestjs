export interface CreateSubjectClassReq {
  subjectId: string;
  teacherId: string;
  name: string;
}

export interface UpdateSubjectClassReq {
  teacherId?: string;
  name?: string;
}
