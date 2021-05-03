import {
  removeTabs,
  getWindowTabs,
  openOptionsPage,
  getAllWindowsInfo
} from './utils'
import { ChromeTab } from '../types'
import { onMessage, clearLogRegularly, dateFormat } from '../utils'
import { addGroup } from '../options/store'
type AddGroupParam = Parameters<typeof addGroup>['0']

let lastFocusWindowId = chrome.windows.WINDOW_ID_NONE
let willSaveGroup: AddGroupParam[] = []

const addWillSaveGroup = (group: AddGroupParam | AddGroupParam[]) => {
  willSaveGroup = willSaveGroup.concat(group)
}

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId > 0) {
    lastFocusWindowId = windowId
  }
})

clearLogRegularly()

const { on } = onMessage()

const filterOptionsPage = (tabs: ChromeTab[]) => {
  return tabs.filter(
    item => item && item.id && !(item.url || '').includes('chrome-extension://')
  ) as (ChromeTab & { id: number })[]
}

on('close-cur-tabs', async () => {
  const tabs = await getWindowTabs()
  await openOptionsPage()
  const filtered = filterOptionsPage(tabs)
  if (!filtered.length) return
  await removeTabs(filtered.map(item => item.id))
  addWillSaveGroup({
    time: dateFormat(),
    incognito: filtered[0].incognito,
    tabs: filtered.map(item => ({
      favIconUrl: item.favIconUrl,
      url: item.url,
      name: item.title
    }))
  })
})

on('close-all-tabs', async () => {
  const windows = await getAllWindowsInfo()
  const removeTabIds = windows
    .map(item => {
      const focused = item.id === lastFocusWindowId
      const tabs = (focused
        ? filterOptionsPage(item.tabs || [])
        : item.tabs || []
      ).filter(item => item.id)

      addWillSaveGroup({
        time: dateFormat(),
        incognito: tabs[0].incognito,
        tabs: tabs.map(item => ({
          favIconUrl: item.favIconUrl,
          url: item.url,
          name: item.title
        }))
      })

      return tabs.map(item => item.id)
    })
    .flat(1) as number[]
  await openOptionsPage()
  await removeTabs(removeTabIds)
})

on('get-all-windows-info', async () => {
  return await getAllWindowsInfo()
})

on('get-last-focus-window-id', () => {
  return lastFocusWindowId
})

on('get-will-save-groups', () => {
  let t = willSaveGroup
  willSaveGroup = []
  return t
})
