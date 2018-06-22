const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow = null

const createWindow = () => {
    mainWindow = new BrowserWindow({
        minWidth: 300,
        minHeight: 400,
        width: 300,
        height: 400,
        show: false,
        resizable: true
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    ipcMain.on('maximize', () => {
        if ( mainWindow.isMaximized() ) {
            mainWindow.unmaximize();
            mainWindow.setResizable(false);
        }
        else {
            mainWindow.setResizable(true);
            mainWindow.maximize();
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    if ( process.env.HOT ) {
        mainWindow.loadURL(`file://${__dirname}/index.html`);
    }
    else {
        mainWindow.loadURL(`file://${__dirname}/../index.html`);
    }
}

app.on('ready', () => {
    createWindow()
})
