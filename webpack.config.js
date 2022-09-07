import { URL } from 'url'

const __dirname = new URL('.', import.meta.url).pathname.slice(1)

export default {
  entry: './src/imui.js',
  output: {
    filename: 'bfont-imui.js',
    path: __dirname + 'dist',
    library: {
        name: 'imui',
        type: 'umd'
    }
  },
  devtool: 'source-map',
  externals: ['bfontjs', 'canvas']
}