export interface CreateStudentReq {
  name: string;
  address: string;
  birthday: Date;
  authId: string;
}

export interface UpdateStudentReq {
  name?: string;
  address?: string;
  birthday?: Date;
}
