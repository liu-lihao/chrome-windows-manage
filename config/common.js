import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue'
import sassPlugin from 'esbuild-plugin-sass'
import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'

export const projectDir = process.cwd()

export const dateFormat = (
  dateObj = new Date(),
  fmt = 'yyyy-MM-dd hh:mm:ss'
) => {
  const o = {
    'M+': dateObj.getMonth() + 1, // 月份
    'd+': dateObj.getDate(), // 日
    'h+': dateObj.getHours(), // 小时
    'm+': dateObj.getMinutes(), // 分
    's+': dateObj.getSeconds(), // 秒
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
    S: dateObj.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${dateObj.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? String(o[k])
          : `00${o[k]}`.substr(`${o[k]}`.length)
      )
    }
  }
  return fmt
}

const originBuild = config => {
  return esbuild.build({
    entryPoints: {
      background: 'src/background/index.ts',
      'options/index': 'src/options/index.ts',
      'popup/index': 'src/popup/index.ts'
    },
    bundle: true,
    write: true,
    outdir: 'dist',
    plugins: [sassPlugin(), vuePlugin(), ...(config.plugins || [])],
    ..._.omit(config, 'plugins')
  })
}

const removeDist = () => fs.remove(path.resolve(projectDir, './dist'))

const copyPublic = () =>
  fs.copy(
    path.resolve(projectDir, './public'),
    path.resolve(projectDir, './dist')
  )

const completeBuild = (config = {}) =>
  removeDist()
    .then(() => originBuild(config))
    .then(() => copyPublic())

export const esBuildProject = () => {
  let isBuilding = false
  let needBuild = false
  let count = 0
  const build = (config = {}) => {
    isBuilding = true
    needBuild = false
    console.log(
      `🤜 [${dateFormat(new Date(), 'hh:mm:ss')}] 开始 build ~`,
      ++count
    )
    const startTime = Date.now()
    return completeBuild(config)
      .then(() =>
        console.log(
          `🌟 [${dateFormat(new Date(), 'hh:mm:ss')}] 结束 build ` +
            (Date.now() - startTime) +
            'ms'
        )
      )
      .catch(err => console.log('出错啦：', err))
      .finally(() => {
        isBuilding = false
        needBuild && build()
      })
  }

  const safeBuild = (config = {}) => {
    if (isBuilding) return (needBuild = true)
    build(config)
  }

  return {
    build,
    safeBuild
  }
}
