

module.exports = {
  entryFiles: ['app.ts', 'app.wxss', 'app.json'],
  cache: false,
  alias: {
    "jgb-weapp": "../lib"
  },
  presets: ['weapp'],
  plugins: [['less', {
    extensions: ['.wxss'],
    outExt: '.wxss'
  }], 'typescript']
}
