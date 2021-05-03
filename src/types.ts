type WindowCallBack = Parameters<typeof chrome.windows.get>[2]
type TabCallback = Parameters<typeof chrome.tabs.get>[1]

export type ChromeWindow = Parameters<WindowCallBack>[0]
export type ChromeTab = Parameters<TabCallback>[0]
