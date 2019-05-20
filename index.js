const electron = require("electron");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit() );

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});
function createAddWindow(){
 addWindow = new BrowserWindow({
     width: 300,
     height: 200,
     title: 'Add new Todo'
 });
 addWindow.loadURL(`file://${__dirname}/add.html`);
 addWindow.on('closed', () => addWindow = null)
}
ipcMain.on('todo:add', (event, value) => {
    mainWindow.webContents.send('todo:add',value);
    console.log("value", value);
    addWindow.close();
});
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Todos',
                click(){
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === 'darwin'){
    menuTemplate.unshift({});
}
//production
//development
//test
//staging
if(process.env.NODE_ENV !== "production"){
    menuTemplate.push(
        {   role:'reload'   },
        {   label: 'View',
            submenu: [{
                label: "Toogle Developer Tools",
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}