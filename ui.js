class ChatUI {
    constructor(p){
        this.paper = p;
    }

    set paper(p){
        this._paper = p;
    }
    get paper(){
        return this._paper;
    }

    template(ms){
        let id = ms.id;
        let msg = ms.data();
        let date = this.formatDate(msg);

        let nowUser = localStorage.name
        let color = localStorage.color

        if(nowUser == msg.username){
            let htmlLi =
            `<li id="${id}" title="${msg.username}" style="background: ${color}; list-style-image: url(./img/user.png);">
                ${msg.username}: ${msg.message}
                <br>
                ${date} <i class="fas fa-trash-alt trashIcon"></i>
            </li>`;
            this.paper.innerHTML += htmlLi;
        } else{
            let htmlLi =
            `<li class="right" id="${id}" title="${msg.username}" style="background: ${color}">
                ${msg.username}: ${msg.message}
                <br>
                ${date} <i class="fas fa-trash-alt trashIcon"></i>
            </li>`;
            this.paper.innerHTML += htmlLi;
        }

    }

    formatDate(d){
        let date = d.createdAt.toDate();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        
        day = String(day).padStart(2,"0");
        month = String(month).padStart(2,"0");
        hours = String(hours).padStart(2,"0");
        minutes = String(minutes).padStart(2, "0");
        
        let newDate = new Date();
        let dateString;

        if(newDate.toLocaleDateString() === date.toLocaleDateString()){
            dateString = `${hours}:${minutes}`;
        } else{
            dateString = `${day}.${month}.${year}. - ${hours}:${minutes}`;
        }

        return dateString;
    }

    clear(){
        this.paper.innerHTML = '';
    }

}

export default ChatUI;
