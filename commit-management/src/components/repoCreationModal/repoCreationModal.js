class RepoCreationModal extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        newValue ? $(this).show() : $(this).hide()
    }

    connectedCallback() {
        $(this).attr('id', 'repo-creation-modal')
        $(this).css('display', 'none')
        $(this).attr('open', false)
        $(this).html(`
       <div style="height: 100%;width: 100%">
            <div style="display: flex;width: 100%;justify-content: center;margin-top: 5%;position: absolute;">
                <div style="color:white;display: flex;justify-content: center;background-color:#333333;padding:1%;flex-wrap: wrap;width: 90%;border-radius: 5px;border: 2px solid #11a7a7">
                    <div style="width: 100%"><h2>Repository creation</h2></div>
                    <div style="width: 100%">      
                        <label for="repo-name">Repository name</label>
                        <input type="text" id="repo-name"  placeholder="Enter the new repository name" class="form-control">
                    </div>
                    <div style="display: flex;justify-content: flex-end;width: 100%">
                        <button style="margin: 1%" class="btn btn-primary" id="dismiss-repo-creation-modal">Cancel</button>
                        <button style="margin: 1%" class="btn btn-primary" id="create-repo">Create</button>
                    </div>
               </div>
            </div>
        </div>
        `)
        $('#dismiss-repo-creation-modal').on('click', () => {
            $('#repo-name').val('')
            $(this).attr('open', false)
        })
        $('#create-repo').on('click', () => {
            ipcRenderer.send('create-new-repo', $('#repo-name').val())
            $('#dismiss-repo-creation-modal').trigger('click')
        })
        ipcRenderer.on('create-new-repo-reply', async (event, data) => {
            const {repo} = JSON.parse(data)
            $('#repo-list').append(`<repository-list-item style="width: 100%" repository=${JSON.stringify(repo)}></repository-list-item>`)
        })
    }
}

customElements.define('repo-creation-modal', RepoCreationModal);