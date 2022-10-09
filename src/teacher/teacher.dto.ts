export interface CreateTeacherReq {
  name: string;
  address: string;
  phone?: string;
}

export interface UpdateTeacherReq {
  name?: string;
  address?: string;
  phone?: string;
}
