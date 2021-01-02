class StagedFilesListBox extends HTMLElement {

    constructor() {
        super();
        this.stagedFiles = JSON.parse($(this).attr('stagedFiles'))
    }


    attributeChangedCallback(name, oldValue, newValue) {
        debugger
        this.stagedFiles = JSON.parse(newValue)
    }
    connectedCallback() {
        $(this).html(`
       
     `)
    }
}

customElements.define('staged-files-listbox', StagedFilesListBox)

