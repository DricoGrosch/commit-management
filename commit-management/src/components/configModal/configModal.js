class ConfigModal extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    constructor() {
        super();
        this.config = CONTEXT.config
    }

    attributeChangedCallback(name, oldValue, newValue) {
        newValue ? $(this).show() : $(this).hide()
    }

    getFolder(files) {
        const folderName = files[0].webkitRelativePath.split('/')[0]
        let path = files[0].path.replace(/\\/g, '/').split('/')
        path = path.slice(0, path.indexOf(folderName) + 1).join('/')
        return path
    }

    connectedCallback() {
        $(this).css('display', 'none')
        $(this).attr('id', 'config-modal')

        $(this).html(`
            <div style="height: 100%;width: 100%">
            <div style="display: flex;width: 100%;justify-content: center;margin-top: 5%;position: absolute;">
                <div style="color:white;display: flex;justify-content: center;background-color:#333333;padding:1%;flex-wrap: wrap;width: 90%;border-radius: 5px;border: 2px solid #11a7a7">
                    <div style="width: 100%"><h2>Config handler</h2></div>
                    <div style="width: 100%">      
                        <label for="repo-name">Repository name</label>
                        <input readonly type="text" placeholder="${this.config.repositoriesFolder ?? 'Selecione o respositório'}" id="repo-folder" class="form-control">
                        <label for="repo-name">Commit interval</label>
                        <input type="number" value="${this.config.commitInterval}"id="commit-interval"  placeholder="Enter the commit interval" class="form-control">
                    </div>
                    <div style="display: flex;justify-content: flex-end;width: 100%">
                        <button style="margin: 1%" class="btn btn-primary" id="dismiss-config-modal">Cancel</button>
                        <button style="margin: 1%" class="btn btn-primary" id="save-config">Save</button>
                    </div>
               </div>
            </div>
        </div>
            `)
        $('#dismiss-config-modal').on('click', () => {
            $(this).attr('open', false)
            $('#repo-folder').val('')
            $('#commit-interval').val('')
        })
        $('#repo-folder').on('click', (e) => {
            e.preventDefault()
            ipcRenderer.send('select-dir', JSON.stringify(CONTEXT.windowId))
        })
        $('#commit-interval').on('change', (e) => {
            this.config.commitInterval = e.target.value
        })
        $('#save-config').on('click', () => {
            ipcRenderer.send('save-config', JSON.stringify(this.config))
        })
        ipcRenderer.on('selected-dir', (e, data) => {
            $('#repo-folder').attr('placeholder', data)
            this.config.repositoriesFolder = data
        })

    }
}

customElements.define('config-modal', ConfigModal)