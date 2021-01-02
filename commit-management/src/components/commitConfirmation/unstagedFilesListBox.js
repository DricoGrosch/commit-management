class UnstagedFilesListBox extends HTMLElement {

    constructor() {
        super();
        this.unstagedFiles = JSON.parse($(this).attr('unstagedFiles'))
    }


    attributeChangedCallback(name, oldValue, newValue) {
        debugger
        this.unstagedFiles = JSON.parse(newValue)
    }
    connectedCallback() {
        $(this).html(`
        <div style="width: 50%">
            ${this.unstagedFiles.reduce((content, file) => content += `<file-confirmation actionCallback="${this.stageFile}" action="stage" path="${file.relativePath}"></file-confirmation>`, '')}
        </div>
     `)
    }
}

customElements.define('unstaged-files-listbox', UnstagedFilesListBox)

