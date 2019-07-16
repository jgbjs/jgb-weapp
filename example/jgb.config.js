

module.exports = {
  entryFiles: ['app.ts', 'app.wxss', 'app.json'],
  cache: false,
  alias: {
    "jgb-weapp": "../src"
  },
  presets: ['weapp'],
  plugins: [['less', {
    extensions: ['.wxss'],
    outExt: '.wxss'
  }], 'typescript']
}
