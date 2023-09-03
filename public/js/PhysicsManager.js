export default class PhysicManager{
    constructor() {
    }

    static update(obj, mapManager, gameManager, eventManager){
        if (obj.move_x === 0 && obj.move_y === 0 && obj.name !== 'player') {
            return 'stop';
        }
        //*Новые координаты
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let ts 
        if (obj.move_x === 1) {
            ts = mapManager.getTilesetIdx(newX + 32 +  obj.size_x / 2, newY + obj.size_y / 2);
        }
        else {
            console.log("NEW TS");
            ts = mapManager.getTilesetIdx(newX - 32 +  obj.size_x / 2, newY + obj.size_y / 2);
        }
        // let ts = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2);
        if (obj.name === 'player'  && !obj.is_jump){
            newY = obj.pos_y + Math.floor(obj.move_y * obj.speed + 6);
            let t = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + 30 + obj.size_y / 2);
            if (t) {
                newY = obj.pos_y;
            }
            if (newY === obj.pos_y && obj.move_x !== 0) {
                let a = newX + obj.size_x / 2;
                let b = newY + obj.size_y;
                ts = mapManager.getTilesetIdx(a, b);
            }
        }

        let e = this.entityAtXY(obj, newX, newY, gameManager);

        if (obj.name === 'player') {
            obj.is_jump = false;
            eventManager.action["jump"] = false;
        }
        if (e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e, gameManager);
        }
        else {
            if (obj.name === 'player') {
                for (let i = 0; i < 7; i++) {
                    let tmpx = newX + i * mapManager.tSize.x;
                    let e1 = this.entityAtXY(obj, tmpx, newY, gameManager);
                    if (e1 !== null && e1.name === 'enemy2') {
                        e1.move_x = -1;
                        e1.speed = 2;
                        break;
                    }
                    tmpx = newX - i * mapManager.tSize.x;
                    let e2 = this.entityAtXY(obj, tmpx, newY, gameManager);
                    if (e2 !== null && e2.name === 'enemy2') {
                        e2.move_x = 1;
                        e2.speed = 3;
                        break;
                    }
                }
            }
        }

        if (newX > 0 && newX < 1884 && newY > 0 && newY < 512 && e === null && !ts && newX >= 0 && newY >= 0){
            obj.pos_x = newX;
            obj.pos_y = newY;
        }
        else {
            return 'break';
        }
        return 'move';
    }

    // static groundAtXY(obj, x, y, mapManager) {
    //     let ts = mapManager.getTilesetIdx(x, y);
    //     console.log("TS", ts);
    //     if ( !ts) {
    //         return 1;
    //     }
    //     else {
    //         return 0;
    //     }
    // }

    //*Ищем объект по координатам
    //*Для определения столкновения по заданным координатам
    static entityAtXY(obj, x, y, gameManager) {
        for (let i=0;i < gameManager.entities.length;i++){
            let e = gameManager.entities[i];
            if (e.name!==obj.name){
                if (x + obj.size_x < e.pos_x || y + obj.size_y<e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y) {
                    //*Объекты не пересекаются
                    continue;
                }
                return e;
            }
        }
        return null;
    }
}