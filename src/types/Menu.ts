export interface MenuParams {
  id: number
  parentId?: number
  path?: string
  icon?: string
  menuName: string
  menuType: number
  sort: number
  level: number
  levelChain: string
}

export interface MenuItem extends MenuParams {
  children?: MenuItem[]
}
