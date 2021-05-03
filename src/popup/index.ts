import { ChromeWindow } from '../types'
import { onMessage } from '../utils'

import './index.scss'

document.body.innerHTML = `
  <button class="close-cur">关闭当前(<span></span>)</button>
  <button class="close-all">关闭所有(<span></span>)</button>
`

let cur: Element | null = null
let all: Element | null = null

window.requestAnimationFrame(() => {
  cur = document.querySelector('.close-cur')
  all = document.querySelector('.close-all')
  cur?.addEventListener('click', removeCur)
  all?.addEventListener('click', removeAll)
  syncTabCount()
})

const { emit } = onMessage()

const removeCur = () => {
  emit('close-cur-tabs')
}
const removeAll = () => {
  emit('close-all-tabs')
}

const syncTabCount = () => {
  emit<ChromeWindow[]>('get-all-windows-info').then(async windows => {
    const focusId = await emit('get-last-focus-window-id')
    const curSpan = document.querySelector('.close-cur span')
    const allSpan = document.querySelector('.close-all span')
    curSpan!.innerHTML =
      windows.find(item => item.id === focusId)?.tabs?.length.toString() || '0'
    if (windows.length === 1) {
      all?.parentElement?.removeChild(all)
    } else {
      allSpan!.innerHTML =
        windows.map((item: any) => item.tabs.length).join(',') || '0'
    }
  })
}
