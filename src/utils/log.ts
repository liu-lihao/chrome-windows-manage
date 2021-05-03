/**
 * clear log
 */
export const clearLogRegularly = () => {
  setInterval(() => {
    console.clear()
  }, 5 * 60 * 1000)
}
