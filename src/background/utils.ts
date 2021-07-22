import { isNumber } from 'lodash'
import { ChromeTab, ChromeWindow } from '../types'

/**
 * 打开 options 页
 */
export const openOptionsPage = () => {
  return new Promise<void>((resolve, reject) => {
    chrome.runtime.openOptionsPage(() => resolve())
  })
}

/**
 * 获取窗口 tab 信息
 */
export const getWindowTabs = (windowId?: number) => {
  return new Promise<ChromeTab[]>((resolve, reject) => {
    chrome.tabs.query(
      isNumber(windowId) ? { windowId } : { currentWindow: true },
      resolve
    )
  })
}

/**
 * 根据 tabIds 关闭tab
 */
export const removeTabs = (tabIds: number[]) => {
  return new Promise<void>((resolve, reject) => {
    console.log('removeTabs', tabIds)
    if (!tabIds.length) {
      return resolve()
    }
    chrome.tabs.remove(tabIds, () => {
      resolve()
    })
  })
}

/**
 * 获取所有常规窗口详情
 */
export const getAllWindowsInfo = (
  config: Partial<Parameters<typeof chrome.windows.getAll>['0']> = {}
) => {
  return new Promise<ChromeWindow[]>(resolve => {
    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ['normal'],
        ...config
      },
      resolve
    )
  })
}
