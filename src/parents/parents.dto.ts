export interface CreateParentsReq {
  name: string;
  address: string;
  phone?: string;
}

export interface UpdateParentsReq {
  name?: string;
  address?: string;
  phone?: string;
}
