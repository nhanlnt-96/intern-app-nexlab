export interface IStaffData {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cardId: string;
  avatarUrl: string;
}

export interface IAccountDetail {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  isLogged: boolean;
}

export interface IStaffApiData {
  address?: string;
  avatarUrl?: string;
  cardId: string;
  createdAt?: string;
  createdBy?: string;
  description?: string;
  dob?: string;
  education?: string;
  email: string;
  emailNotify?: string;
  firstName: string;
  homeTown?: null;
  id?: string;
  isEmailVerified?: string;
  lastName: string;
  majorIn?: string;
  onboardDate?: string;
  phone?: string;
  religion?: string;
  role: string;
  sex: string;
  status: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string;
}
