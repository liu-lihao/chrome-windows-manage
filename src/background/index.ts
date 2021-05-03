import {
  backgroundMessage,
  getAllWindows,
  openOptionsPage,
  getWindowTabs,
  removeTabs,
  getAllWindowsInfo,
  clearLogRegularly
} from './utils'
import { ChromeTab } from '../types'

let lastFocusWindowId = chrome.windows.WINDOW_ID_NONE

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId > 0) {
    lastFocusWindowId = windowId
  }
})

clearLogRegularly()

const { on } = backgroundMessage()

const filterOptionsPage = (tabs: ChromeTab[]) => {
  return tabs.filter(
    item => item && item.id && !(item.url || '').includes('chrome-extension://')
  ) as (ChromeTab & { id: number })[]
}

on('close-cur-tabs', async () => {
  const tabs = await getWindowTabs()
  await openOptionsPage()
  const removeTabIds = filterOptionsPage(tabs).map(item => item.id)
  await removeTabs(removeTabIds)
})

on('close-all-tabs', async () => {
  const windows = await getAllWindowsInfo()
  const removeTabIds = windows
    .map(item => {
      const focused = item.id === lastFocusWindowId
      const tabs = focused
        ? filterOptionsPage(item.tabs || [])
        : item.tabs || []
      return tabs.map(item => item.id).filter(id => id)
    })
    .flat(1) as number[]
  await openOptionsPage()
  await removeTabs(removeTabIds)
})
