export interface User {
  id: number
  name: string
  email: string
  password: string
}

export type Users = User[]

export interface UsersResponse {
  data: {
    users: Users
  }
  count: number
}
