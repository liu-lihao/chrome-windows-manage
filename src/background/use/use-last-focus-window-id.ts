import { getAllWindowsInfo } from '../utils'

export const useLastFocusWindowId = () => {
  const idRef = {
    value: chrome.windows.WINDOW_ID_NONE
  }

  // 默认窗口 id
  getAllWindowsInfo({ populate: false }).then(windows => {
    if (idRef.value > 0) return
    if (!windows.length) return
    const focused = windows.find(w => w.focused === true) || windows[0]
    idRef.value = focused.id
  })

  chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId > 0) {
      idRef.value = windowId
    }
  })

  return idRef
}
