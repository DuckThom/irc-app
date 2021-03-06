const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const irc = require('irc');
const http = require('http').createServer();
const io = require('socket.io')(http);
const debug = require('debug');

let config;

try {
    config = require('./config.json');
} catch (ex) {
    throw ex;
}

http.listen(8888);

const BUILD_PATH = path.join(__dirname, 'static');
const SRC_PATH = path.join(__dirname, 'src');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let ircClient;

function stripUnicode(str) {
    debug('irc-app')("Stripping unicode from: " + str);

    if (typeof str === 'string') {
        return str.replace(/[\u{0080}-\u{FFFF}]/gu, "");
    }

    return str;
}

function createWindow () {

    ircClient = new irc.Client(config.irc.server, config.irc.nickname, config.irc.config);

    ircClient.addListener('message', function (from, to, message) {
        debug('node-irc')({
            type: "message",
            from: from,
            to: to,
            message: stripUnicode(message)
        });

        if (to.indexOf("#") > -1 || from === config.irc.nickname) {
            io.sockets.emit('channel-message-receive', {
                from: from,
                to: to,
                message: stripUnicode(message)
            });
        }
    });

    ircClient.addListener('pm', function (from, message) {
        debug('node-irc')({
            type: "pm",
            from: from,
            message: stripUnicode(message)
        });

        io.sockets.emit('private-message-receive', {
            from: from,
            message: stripUnicode(message)
        });
    });

    ircClient.addListener('error', function(message) {
        debug('node-irc')({
            type: "error",
            message: stripUnicode(message)
        });

        io.sockets.emit('irc-client-error', {
            message: stripUnicode(message)
        });
    });

    ircClient.addListener('raw', function (message) {
        debug('node-irc')({
            type: "raw",
            data: message
        });
    });

    io.on('connection', function (socket) {
        debug('socket.io')('Client connected');

        socket.on('send-message', function (data) {
            ircClient.say(data.to, data.text);

            io.sockets.emit('channel-message-receive', {
                from: config.irc.nickname,
                to: data.to,
                message: stripUnicode(data.text)
            });
        });

        socket.on('join-channel', function (data) {
            const channel = data.channel;

            if (channel.indexOf('#') === -1) {
                io.sockets.emit('query-start', {
                    nick: channel
                });

                return;
            }

            ircClient.join(data.channel);
        });
    });

    // Create the browser window.
    win = new BrowserWindow({
        width: 1368,
        height: 768,
        minWidth: 730,
        minHeight: 300
    });

    // Remove the menu bar
    win.setMenu(null);

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(BUILD_PATH, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    if (debug('irc-app').enabled) {
        win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        ircClient.disconnect();
        win = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

