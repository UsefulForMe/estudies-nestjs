export interface CreateTeacherReq {
  name: string;
  address: string;
}

export interface UpdateTeacherReq {
  name?: string;
  address?: string;
}
