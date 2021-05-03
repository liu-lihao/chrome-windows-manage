import localForage from 'localforage'

export type TabItem = Partial<{
  favIconUrl: string
  url: string
  title: string
}>

export type GroupItem = {
  time: string
  incognito: boolean
  name: string
  tabsId: number
  length: number
}

/**
 * 数据库设计
 *
 * type TabsStore = {
 *   maxId: number
 *   [id: number]: TabItem[]
 * }
 *
 * type GroupsStore = {
 *   maxId: number
 *   [groupId: number]: GroupItem[]
 * }
 *
 * type GroupRecordsStore = {
 *   records: number[] // 如： [202105, 202106]
 *   [record: number]: number[] // groupId
 * }
 */

// 自增 ID 的 key
export const MAX_ID_KEY = 'maxId'

export const tabsStore = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: 'tabs-store',
  description: 'tabs 的映射'
})

export const groupsStore = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: 'groups-store',
  description: 'groups 的映射'
})

export const groupRecordsStore = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: 'group-records-store',
  description: 'group-records 按年月记录 groupId'
})
