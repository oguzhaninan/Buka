const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')

const electron = require('electron')

const electronConnect = require('electron-connect');

let win

function createWindow() {

    const _width = 1200, _height = 800
    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 800,
        minHeight: 600,
        icon: './assets/img/icon.png'
    })

    try {
        const screenSize = electron.screen.getPrimaryDisplay().size;
        win.setPosition((screenSize.width - _width) / 2,
            (screenSize.height - _height) / 2)
    }
    catch (er) {
        win.center()
    }

    win.setMenu(null)

    win.loadURL(`file://${__dirname}/bundle/index.html`)

    const client = electronConnect.client.create(win);

    win.on("closed", () => {
        win = null;
        client.sendMessage('closed');
    });

}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    app.quit()
})

app.on("activate", () => {

    if (win === null)
        createWindow()

})
