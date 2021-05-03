import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue'
import sassPlugin from 'esbuild-plugin-sass'
import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'

export const projectDir = process.cwd()

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
    console.log('🤜 开始 build ~', ++count)
    const startTime = Date.now()
    return completeBuild(config)
      .then(() =>
        console.log('🌟 结束 build ' + (Date.now() - startTime) + 'ms')
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
