import { isNumber } from 'lodash'
import { ChromeTab, ChromeWindow } from '../types'

/**
 * clear log
 */
export const clearLogRegularly = () => {
  setInterval(() => {
    console.clear()
  }, 5 * 60 * 1000)
}

/**
 * 通信事件及方法
 */
export const backgroundMessage = () => {
  const events: Record<string, Function> = {}
  chrome.runtime.onMessage.addListener((msg, sender, cb) => {
    const fulfill = (res: any) => {
      cb(res)
    }
    const func = events[msg.op]
    if (func) {
      const temp = func(msg.params)
      if (temp && temp.then) {
        temp.then(fulfill)
      } else {
        fulfill(temp)
      }
    }
    return true
  })
  const on = (key: string, event: Function) => {
    events[key] = event
  }
  return {
    on
  }
}

/**
 * 获取所有窗口信息
 */
export const getAllWindows = () => {
  return new Promise((resolve, reject) => {
    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ['normal']
      },
      windows => {
        resolve(windows)
      }
    )
  })
}

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
export const getAllWindowsInfo = () => {
  return new Promise<ChromeWindow[]>(resolve => {
    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ['normal']
      },
      resolve
    )
  })
}
