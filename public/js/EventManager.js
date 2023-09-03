export default class EventManager {
    constructor() {
        this.bind = [];
        this.action = [];
    }

    setup(canvas, body){
        this.bind[65] = 'left';
        this.bind[68] = 'right';
        this.bind[32] = 'jump';

        body.addEventListener('keydown', event => {
            let action = this.bind[event.keyCode];
            if (action === 'jump' && !this.action[action]) {
                this.action[action] = true;    //согласились выполнять действие
            } else {
                if(action !== 'jump'){
                    this.action[action] = true;
                }
            }  
        });
        
        body.addEventListener('keyup', event => {
            let action = this.bind[event.keyCode];
            if(action !== 'jump') {
                this.action[action] = false;   //отменили действие
            }    
        });
    }
}