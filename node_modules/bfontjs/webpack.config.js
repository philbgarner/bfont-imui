import { URL } from 'url'

const __dirname = new URL('.', import.meta.url).pathname.slice(1)

export default {
  entry: './src/bfontjs.js',
  output: {
    filename: 'bfontjs.js',
    path: __dirname + 'dist',
    library: {
        name: 'bfontjs',
        type: 'umd'
    }
  },
  externals: ['canvas', 'fs', 'url']
}