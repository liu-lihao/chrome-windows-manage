import { callApi } from './utils'

import './index.scss'

document.body.innerHTML = `
  <button class="close-cur">关闭当前窗口所有</button>
  <button class="close-all">关闭所有</button>
`
window.requestAnimationFrame(() => {
  document.querySelector('.close-cur')?.addEventListener('click', removeCur)
  document.querySelector('.close-all')?.addEventListener('click', removeAll)
})

const removeCur = () => {
  callApi('close-cur-tabs')
}
const removeAll = () => {
  callApi('close-all-tabs')
}
