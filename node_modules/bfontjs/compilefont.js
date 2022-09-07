import { GenerateBlankCodepage } from './src/bfontjs.js'

const args = process.argv.slice(2)
if (args[0]) {
    console.log('Generating 437 font file and saving to', args[0])
    GenerateBlankCodepage(args[0], args[1])
} else {
    console.log('No input bitmap filename passed.')
}
