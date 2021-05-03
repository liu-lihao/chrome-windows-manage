import { esBuildProject } from './common.js'

const { build } = esBuildProject()

build({
  minify: true,
  sourcemap: false
})
