const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

const SplashScreen = require('@trodi/electron-splashscreen');

let mainWindow = null

const createWindow = () => {
    const WINDOW_WIDTH = 450;
    const WINDOW_HEIGHT = 450;

    //Definindo centro da tela principal
    let bounds = electron.screen.getPrimaryDisplay().bounds;
    let x = Math.ceil(bounds.x + ((bounds.width - WINDOW_WIDTH) / 2));
    let y = Math.ceil(bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2));

    mainWindow = SplashScreen.initSplashScreen({
        windowOpts: {
            minWidth: 440,
            minHeight: 600,
            width: 440,
            height: 600,
            show: false,
            resizable: false
        },
        templateUrl: process.env.HOT ? `${__dirname}/splash.html` : `${__dirname}/../splash.html`,
        splashScreenOpts: {
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            x: x,
            y: y,
            resizable: false,
            center: true,
            transparent: true
        },
        delay: 0
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    ipcMain.on('maximize', () => {
        if ( ! mainWindow.isMaximized() ) {
            mainWindow.setResizable(true);
            mainWindow.maximize();
        }
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
});

app.on("window-all-closed", () => {
    app.quit();
});
