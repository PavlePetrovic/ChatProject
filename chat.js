class Chatroom {
    constructor(r, u){
        this.room = r;
        this.username = u;
        this.chats = db.collection('Chats');
        this.unsub = false;
    }

    set room(r){
        this._room = r;
    }
    get room(){
        return this._room;
    }

    set username(u){
        let user = u.trim();
        if ( user.length >= 2 && user.length <= 10 ){
            this._username = user;
        }
    }
    get username(){
        return this._username;
    }

    async addChat(msg){
        let now = new Date();
        let dateTimestamp = firebase.firestore.Timestamp.fromDate(now);

        if (msg != ''){ 
            let obj = {
                message: msg,
                username: this.username,
                room: this.room,
                createdAt: dateTimestamp
            }
            let response = await this.chats.add(obj)
            return response; // Vraca Promis
        }

    }

    getChats(callback){
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('createdAt')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach( change => {
                if(change.type == 'added'){
                    callback(change.doc);
                }
            })
        })
    }

    roomUpdate(newRoom){
        this.room = newRoom.id;
        if(this.unsub != false){
            this.unsub();
        }
        newRoom.parentNode.classList.add('active');
    }

    deleteMsg(id){
        this.chats
        .doc(id)
        .delete()
        .then()
        .catch(err => {
            console.log(`Greska: ${err}`);
        });
    }
}

export default Chatroom;