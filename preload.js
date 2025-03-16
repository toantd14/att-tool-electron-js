const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),

    // we can also expose variables, not just functions
    login: (data) => ipcRenderer.send("user:login", data),
    getUser: async () => {
        const user = await ipcRenderer.invoke("user:get");
        return user;
    },
    logout: () => ipcRenderer.send("user:logout"),
})

ipcRenderer.on("login-failed", (event, message) => {
    document.getElementById("error-message").innerHTML = message;
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
