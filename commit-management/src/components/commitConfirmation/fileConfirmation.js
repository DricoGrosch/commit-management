class FileConfirmation extends HTMLElement {


    connectedCallback() {
        const action = $(this).attr('action')
        console.log($(this).attr('file'))
        console.log(typeof $(this).attr('file'))
        const file = JSON.parse($(this).attr('file'))
        console.log(file)
        const current = $(this).attr('current')
        const target = $(this).attr('target')
        $(this).html(`
        <div style="display:flex;width: 100%">
            <div style="width: 70%;color: white">${file.relativePath}</div>
            <div style="width: 30%"><button class="btn btn-primary actionButton" style="font-size: 12px">${action.toUpperCase()}</button></div>
        </div>
        `)
        $(this).on('click', '.actionButton', () => {
            $('#commit-confirmation').attr(current, (index, currentValue) => {
                return JSON.stringify(JSON.parse(currentValue).filter(({relativePath}) => relativePath !== file.relativePath))
            })
            $('#commit-confirmation').attr(target, (index, currentValue) => {
                return JSON.stringify([...JSON.parse(currentValue), file])
            })
        })
    }
}


customElements.define('file-confirmation', FileConfirmation)