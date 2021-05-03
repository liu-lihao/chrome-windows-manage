import watchr from 'watchr'
import path from 'path'
import { esBuildProject, projectDir } from './common.js'

const WATCH_IGNORE_PATHS = ['/node_modules', '/dist']

const stalker = watchr.create(projectDir)
const { safeBuild } = esBuildProject()

const devBuild = () =>
  safeBuild({
    minify: true,
    sourcemap: false
  })

// changeType, fullPath, currentStat, previousStat
stalker.on('change', () => {
  devBuild()
})

stalker.setConfig({
  stat: null,
  interval: 5007,
  persistent: true,
  catchupDelay: 1000,
  preferredMethods: ['watch', 'watchFile'],
  followLinks: true,
  ignorePaths: WATCH_IGNORE_PATHS.map(n => path.join(projectDir, n)),
  ignoreHiddenFiles: true,
  ignoreCommonPatterns: true,
  ignoreCustomPatterns: null
})

stalker.watch(err => {
  if (err) return console.log('监听失败：', err)
  console.log('我看着呢，代码交给我构建，开始写代码吧~')
  devBuild()
})
