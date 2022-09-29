export interface CreateExamReq {
  name: string;
  type: string;
  duration: number;
  factor: number;
  subjectClassId: string;
}

export interface UpdateExamReq {
  name?: string;
  type?: string;
  duration?: number;
  factor?: number;
}
