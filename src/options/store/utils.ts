import { MAX_ID_KEY } from './database'

/**
 * 为自增id型的数据库添加数据
 */
export const storeAddItem = async (database: LocalForage, data: any) => {
  const max = await database.getItem(MAX_ID_KEY)
  const next = Number(max || 0) + 1
  await database.setItem(MAX_ID_KEY, next)
  await database.setItem(String(next), data)
  return next
}

/**
 * 通过时间获取 group record 的索引
 * @param time def: `new Date()`
 * @return `202105`
 */
export const getRecordIndex = (time = new Date()) => {
  const year = time.getFullYear().toString()
  const month = (time.getMonth() + 1).toString().padStart(2, '0')
  return Number(year + month)
}
