class RepositoryListItem extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        const repo = JSON.parse($(this).attr('repository'))
        $(this).css({
            'width': '100%',
            'cursor': 'pointer',
        })
        console.log(repo.allowAutoCommit)
        $(this).html(`

        <div style="display: flex;
                justify-content: space-around;
                padding: 1%;
                align-items: center;
                border: 2px solid #11A7A7;
                width: 100%;
                color: white;
                font-size: 20px;
                margin: 1% 5%;
                border-radius: 5px;">
            <span>${repo.name}</span>
            <a ><i  ${repo.allowAutoCommit === true || repo.allowAutoCommit === 1
            ? `title='Disable auto commit' class="change-auto-commit fa fa-toggle-on"`
            : `title='Enable auto commit' class="change-auto-commit fa fa-toggle-off" `}>
            </i></a>
        </div>
        `)
        ipcRenderer.on('reply-change-auto-commit', (e, {success, id}) => {
            if (success && id === repo.id) {
                $(this).find('.change-auto-commit').attr('class', `${repo.allowAutoCommit ? 'change-auto-commit fa fa-toggle-off' : ' change-auto-commit fa fa-toggle-on'}`)
                repo.allowAutoCommit = !repo.allowAutoCommit
            }
        })
        $(this).on('click', () => {
            ipcRenderer.send('change-auto-commit', JSON.stringify({
                id: repo.id,
            }))
        })
    }
}

customElements.define('repository-list-item', RepositoryListItem)