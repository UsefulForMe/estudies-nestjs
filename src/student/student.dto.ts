export interface CreateStudentReq {
  name: string;
  address: string;
  birthday: Date;
  authId: string;
  phone?: string;
}

export interface UpdateStudentReq {
  name?: string;
  address?: string;
  birthday?: Date;
  phone?: string;
}
