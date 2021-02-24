class CommitConfirmation extends HTMLElement {

    static get observedAttributes() {
        return ['stagedfiles', 'unstagedfiles'];
    }

    // constructor() {
    //     super();
    //     this.commitTimer = null
    // ipcRenderer.on('window-focus', (e, data) => {
    //     clearTimeout(this.commitTimer)
    // })
    // ipcRenderer.on('window-blur', (e, data) => {
    //     this.commitTimer = setTimeout(() => {
    //         this.pushCommit()
    //     }, 10000)
    // })
    // }

    updateUnstagedFiles() {
        const files = JSON.parse($(this).attr('unstagedfiles'))
        $('#unstaged-files').html(files.reduce((content, file) => content += `<file-confirmation current="unstagedfiles" target="stagedfiles" action="stage" file=${JSON.stringify(file)}></file-confirmation>`, ''))
    }

    updateStagedFiles() {
        const files = JSON.parse($(this).attr('stagedfiles'))
        console.log(files)
        $('#staged-files').html(files.reduce((content, file) => content += `<file-confirmation current="stagedfiles" target="unstagedfiles" action="unstage" file=${JSON.stringify(file)}></file-confirmation>`, ''))
    }

    attributeChangedCallback(name) {
        name === 'stagedfiles' ? this.updateStagedFiles() : this.updateUnstagedFiles()
    }

    pushCommit = () => {
        ipcRenderer.send(`commit`, JSON.stringify({
            repoId: CONTEXT.repoId,
            windowId: CONTEXT.windowId,
            stagedFiles: JSON.parse($(this).attr('stagedfiles'))
        }))
    }

    connectedCallback() {
        $(this).html(`
        <div style="margin: 1%">
            <div style="font-size: 12px;display: flex">
                <div style="width: 50%" id="unstaged-files">
                </div>
                <div style="width: 50%" id="staged-files">
                </div>
            </div>
            <div style="display: flex;justify-content: flex-end;width: 100%">
                <button class="btn btn-primary" id="pass-commit" style="margin:1%">Wait untill next commit</button>
                <button class="btn btn-primary" id="push-commit" style="margin:1%">Confirm</button>
            </div>
        </div>
        `)

        $(this).attr('stagedfiles', JSON.stringify(CONTEXT.stagedFiles));
        $(this).attr('unstagedfiles', '[]');
        $(this).attr('id', 'commit-confirmation');
        $(this).on('click', '#push-commit', () => {
            this.pushCommit()
        })
        $(this).on('click', `#pass-commit`, () => {
            ipcRenderer.send(`unload-window`, CONTEXT.windowId)
        })
    }
}

customElements.define('commit-confirmation', CommitConfirmation)