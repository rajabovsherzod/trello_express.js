export interface IUser {
    _id: string
    username: string
    email: string
}

export interface UserResponse {
    user: IUser
    accessToken: string
    refreshToken: string
}

export interface Card {
  _id: string;
  name: string;
  description?: string;
  boardId: string;
  listId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  name: string;
  boardId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
}

export interface Board {
  _id: string;
  name: string;
  description: string;
  owner: IUser;
  members: string[];
  visibility: 'private' | 'public';
  background: string;
  createdAt: string;
  updatedAt: string;
  lists?: List[];
}

export interface Invitation {
    _id: string
    boardId: Board | string
    fromUser: IUser | string
    toUserEmail: string
    status: 'pending' | 'accepted' | 'declined'
    createdAt: string
    updatedAt: string
}
