module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/TAURI-akochandaaaaaa/" : "/",
  outputDir: "dist/",
  pwa: {
    name: 'Mahjong Calculator',
    themeColor: '#1a1a1a',
    msTileColor: '#1a1a1a',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent'
  }
};
