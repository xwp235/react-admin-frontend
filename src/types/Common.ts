export interface UserInfo {
  userId: number
  username: string
  createTime: Date
  dataValidPeriod: {
    start: Date
    end: Date
  }
}

