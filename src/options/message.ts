import { onMessage } from '../utils'
import { addGroup } from './store'

const { on, emit } = onMessage()

on('get-will-save-groups', (res: any) => {
  console.log('options res', res)
})

window.addEventListener('load', () => {
  emit('get-will-save-groups').then(async (groups: any) => {
    if (groups && groups.length) {
      for (let i in groups) {
        const group = groups[i]
        await addGroup(group as any)
      }
    }
  })
})
