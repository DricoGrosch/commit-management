class RepositoryList extends HTMLElement {

    constructor() {
        super();
    }

    loadResources() {
        // ipcRenderer.send('get-user-repo')
        // ipcRenderer.on('get-user-repo-reply', async (e, data) => {
        // })
        return []
    }

    connectedCallback() {
        const resources = this.loadResources()
        this.innerHTML = `
         <div>
             ${resources.reduce((content, repo) => content += `<div>${repo.name}</div>`, '')}
         </div>`;
    }
}

customElements.define('repository-list', RepositoryList);

