class CommitConfirmation extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        $(this).attr('stagedFiles', JSON.stringify(CONTEXT.stagedFiles));
        $(this).attr('id', 'commit-confirmation');

        $(this).html(`
        <div style="margin: 1%">
            <div style="font-size: 12px">
                <h3>Modified files</h3>
                ${CONTEXT.stagedFiles.reduce((content, file) => content += `<file-confirmation action="updated" path="${file.relativePath}"></file-confirmation>`, '')}
                <div style="display: flex;width: 100%"></div>
            </div>
            <div style="display: flex;justify-content: flex-end;width: 100%">
                <button class="btn btn-primary" id="pass-commit" style="margin:1%">Wait untill next commit</button>
                <button class="btn btn-primary" id="push-commit" style="margin:1%">Confirm</button>
            </div>
        </div>
        `)
        $(this).on('click', '#push-commit', () => {
            ipcRenderer.send(`commit`, JSON.stringify({
                repoId: CONTEXT.repoId,
                windowId: CONTEXT.windowId,
                stagedFiles: JSON.parse($(this).attr('stagedFiles'))
            }))
        })
        $(this).on('click', `#pass-commit`, () => {
            ipcRenderer.send(`unload-window-${CONTEXT.windowId}`)
        })
    }
}

customElements.define('commit-confirmation', CommitConfirmation)