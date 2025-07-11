export class Address {
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
  complement?: string; 
}

export class UserEntity {
  id?: string;
  firebaseUid: string;
  email: string;
  name?: string;
  surname?: string;
  birthDate?: Date;

  address?: Address; 
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }
}