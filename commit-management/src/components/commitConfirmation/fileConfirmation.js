class FileConfirmation extends HTMLElement {
    getIconByAction(action) {
        switch (action) {
            case 'added': {
                return '<i class="fas fa-plus" style="color: green"></i>'
            }
            case 'updated': {
                return '<i class="fas fa-pencil-alt" style="color: orange"></i>'
            }
            default : {
                return '<i class="fas fa-minus-circle" style="color: red"></i>'
            }
        }
    }

    unstageFile(path) {
        const stagedFiles = JSON.parse($('#commit-confirmation').attr('stagedFiles'))
        $('#commit-confirmation').attr('stagedFiles', JSON.stringify(stagedFiles.filter(({relativePath}) => relativePath !== path)))
        $(this).remove()
    }

    connectedCallback() {
        const action = $(this).attr('action')
        const path = $(this).attr('path')
        $(this).html(`
        <div style="display:flex;width: 100%">
            <div style="width: 70%">${this.getIconByAction(action)} ${path}</div>
            <div style="width: 30%"><button class="btn btn-primary unstageButton" style="font-size: 12px">Unstage</button></div>
        </div>
        `)
        $(this).on('click', '.unstageButton', () => {
            this.unstageFile(path, action)
        })
    }
}


customElements.define('file-confirmation', FileConfirmation)