/**
 * 通信事件及方法
 */
type MessageConfig = {
  origin: string
}

const ERROR_EMIT = '#__ERROR_EMIT'

export const onMessage = () => {
  const events: Record<string, Function> = {}
  chrome.runtime.onMessage.addListener((msg, sender, cb) => {
    const func = events[msg.key]
    if (typeof func === 'function') {
      const temp = func(msg.params)
      if (temp && temp.then) {
        temp.then(cb).catch((err: any) =>
          cb({
            type: ERROR_EMIT,
            err
          })
        )
      } else {
        cb(temp)
      }
    }
    return true
  })
  const emit = <T = unknown>(key: string, params?: any) => {
    return new Promise<T>((resolve, reject) => {
      const fulfill = (res: any) => {
        if (res?.type === ERROR_EMIT) {
          reject(res?.err as unknown)
        } else {
          resolve(res)
        }
      }
      chrome.runtime.sendMessage('', { key, params: params || {} }, {}, res =>
        fulfill(res)
      )
    })
  }
  const on = (key: string, event: Function) => {
    events[key] = event
  }
  return {
    on,
    emit
  }
}
