export const callApi = (op: string, params?: any) => {
  return new Promise((fulfill, reject) => {
    params = params || {}

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      var urlParseRE = /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/
      var matches = urlParseRE.exec(tabs[0].url!)
      params.host = matches![11]

      chrome.runtime.sendMessage('', { op: op, params: params }, {}, fulfill)
    })
  })
}
