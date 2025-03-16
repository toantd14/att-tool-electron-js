const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

updateElectronApp({
    updateSource: [{
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: 'toantd14/att-tool-electron-js'
    }, {
        type: UpdateSourceType.StaticStorage,
        baseUrl: `https://my-bucket.s3.amazonaws.com/my-app-updates/${process.platform}/${process.arch}`
    }],
    updateInterval: '1 hour',
    logger: require('electron-log')
})

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
