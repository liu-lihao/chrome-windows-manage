import { ChromeTab } from '../../types'
import { dateFormat } from '../../utils'
import { storeAddItem, getRecordIndex } from './utils'
import {
  tabsStore,
  groupsStore,
  groupRecordsStore,
  GroupItem
} from './database'

export const addGroup = async (data: {
  time?: string
  name?: string
  incognito?: boolean
  tabs: Pick<ChromeTab, 'url' | 'title' | 'favIconUrl'>[]
}) => {
  const time = data.time || dateFormat()
  const tabsId = await storeAddItem(tabsStore, data.tabs)
  const groupItem: GroupItem = {
    time,
    tabsId: tabsId,
    name: data.name || '',
    length: data.tabs.length,
    incognito: !!data.incognito
  }
  const groupId = await storeAddItem(groupsStore, groupItem)
  const recordIndex = getRecordIndex(new Date(time))
  const records = await getGroupRecords()
  if (!records.includes(recordIndex)) {
    records.push(recordIndex)
    await groupRecordsStore.setItem('records', records)
  }
  const recordInfo = await getGroupRecordDetail(recordIndex)
  recordInfo.push(groupId)
  await groupRecordsStore.setItem(String(recordIndex), recordInfo)
  return {
    record: recordIndex,
    groupId,
    tabsId
  }
}

export const removeGroup = (id: number) => {
  // TODO
}

export const getGroupDetail = (id: number) => {
  return new Promise<GroupItem | null>((resolve, reject) => {
    groupsStore.getItem(String(id)).then(res => {
      resolve((res || null) as GroupItem | null)
    })
  })
}

export const getGroupRecords = () => {
  return new Promise<number[]>((resolve, reject) => {
    groupRecordsStore.getItem('records').then(res => {
      resolve((res || []) as number[])
    })
  })
}

export const getGroupRecordDetail = (record: number) => {
  return new Promise<number[]>((resolve, reject) => {
    groupRecordsStore.getItem(String(record)).then(res => {
      resolve((res || []) as number[])
    })
  })
}
