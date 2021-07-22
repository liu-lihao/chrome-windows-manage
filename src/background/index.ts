import {
  removeTabs,
  getWindowTabs,
  openOptionsPage,
  getAllWindowsInfo
} from './utils'
import { ChromeTab } from '../types'
import { onMessage, clearLogRegularly, dateFormat } from '../utils'
import { useLastFocusWindowId, useWillSaveGroup } from './use'

const optionsPageUrl = chrome.runtime.getURL('options/index.html')

let openOptionTask: Function | null = null
const realOpenOptionsPage = () => {
  return new Promise(resolve => {
    openOptionTask = resolve
    openOptionsPage()
  })
}

clearLogRegularly()
const { on } = onMessage()
const lastFocusWindowIdRef = useLastFocusWindowId()
const { willSaveGroupRef, addWillSaveGroup } = useWillSaveGroup()

const isOptionsPage = (tab: ChromeTab) => {
  return tab && tab.id && !(tab.url || '').includes(optionsPageUrl)
}

const filterOptionsPage = (tabs: ChromeTab[]) => {
  return tabs.filter(isOptionsPage) as (ChromeTab & { id: number })[]
}

const findOptionsPage = (tabs: ChromeTab[]) => {
  return tabs.find(isOptionsPage)
}

on('close-cur-tabs', async () => {
  let tabs = await getWindowTabs()
  const optionsTab = findOptionsPage(tabs)
  if (optionsTab && optionsTab.id) {
    await removeTabs([optionsTab.id])
  }
  // await openOptionsPage()
  await realOpenOptionsPage()
  debugger
  tabs = await getWindowTabs()

  const filtered = filterOptionsPage(tabs)
  if (!filtered.length) return

  console.log('filtered', [...filtered.map(n => ({ ...n }))])

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
      const focused = item.id === lastFocusWindowIdRef.value
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
  return lastFocusWindowIdRef.value
})

on('get-will-save-groups', () => {
  let t = willSaveGroupRef.value
  willSaveGroupRef.value = []
  openOptionTask?.()
  return t
})
