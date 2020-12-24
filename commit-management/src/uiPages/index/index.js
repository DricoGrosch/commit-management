$('#new-repo').click(() => {
    ipcRenderer.send('create-new-repo', $('#repo-name').val())
})