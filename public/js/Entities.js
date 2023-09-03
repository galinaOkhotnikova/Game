import PhysicsManager from "./PhysicsManager.js";

export class Entity {
    constructor() {
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
        this.state = "alive";
    }

    static animConst = 0;

    update(mapManager, gameManager, eventManager) {
        PhysicsManager.update(this, mapManager, gameManager, eventManager);
    }

    kill(gameManager) {
        gameManager.kill(this);
    }

}

export class Player extends Entity {
    constructor() {
        //*для вызова конструктора родительского класса
        super();
        this.life = 3;
        //*Направление движения
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 6;
        this.coins = 0;
        this.is_jump = false;
    }

    draw(ctx, spriteName, playerSpriteManager) {
        playerSpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }

    //*Обработка встречи с препятствием
    onTouchEntity(obj, gameManager) {
        if (obj.name === "coin") {
            gameManager.soundManager.play("/public/sounds/coin.mp3",
                            {looping: false, volume: 0.5});
            this.coins = Number(localStorage.getItem('cw.score'));
            this.coins += 1;
            localStorage.setItem('cw.score', this.coins);
            updateData(this.coins, this.gameManager.level);
            obj.kill(gameManager);
        }
        if(obj.name === "enemy1") {
            console.log("ЖИЗНИ", this.life);
            this.life -= 1;
            if(this.life === 0) {
                this.kill(this.gameManager);
                document.location.href = "/loss";
            }
        }

        if(obj.name === "enemy2") {
            console.log("ЖИЗНИ", this.life);
            this.life = 0;
            if(this.life === 0) {
                this.kill(this.gameManager);
                document.location.href = "/loss";
            }
        }

        if(obj.name === "door") {
            gameManager.soundManager.play("/public/sounds/win.mp3",
                            {looping: false, volume: 0.5});
            this.gameManager.level2(this.gameManager.canvas,this.gameManager.body);
            this.gameManager.level += 1;
            localStorage.setItem('cw.level', this.gameManager.level);
            updateData(this.coins, this.gameManager.level);
        }

        if (obj.name === "exit") {
            saveData();
            document.location.href = "/scores";
        }
    }
    
    jump() {
        this.is_jump = true;
        this.move_y = -4;
        setTimeout(() => {
            this.move_y = 0;
        }, 100);
    }
}

export class Coin extends Entity {
    constructor() {
        super();
    }

    draw(ctx, spriteName, coinSpriteManager) {
        coinSpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }

    //*Уничтожение объекта
    kill(gameManager) {
        gameManager.kill(this);
    }
}

export class Door extends Entity {
    constructor() {
        super();
    }

    draw(ctx, spriteName, doorSpriteManager) {
        doorSpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }
}

export class Exit extends Entity {
    constructor() {
        super();
    }

    draw(ctx, spriteName, exitSpriteManager) {
        exitSpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }

}

export class Enemy1 extends Entity {
    constructor() {
        super();
        this.move_x = 1;
        this.move_y = 0;
        this.speed = 1;
        this.i = 0;
    }

    changeMove() {
        if (this.move_x === 1) {
            this.move_x = -1;
        }
        else {
            this.move_x = 1;
        }
    }

    draw(ctx, spriteName, enemy1SpriteManager) {
        enemy1SpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }

    //*Уничтожение объекта
    kill(gameManager) {
        gameManager.kill(this);
    }

    update(mapManager, gameManager, eventManager) {
        if (this.i % 37 === 0) {
            this.changeMove();
        }
        this.i += 1;

        PhysicsManager.update(this, mapManager, gameManager, eventManager);
    }
}


export class Enemy2 extends Entity {
    constructor() {
        super();
        this.move_x = 1;
        this.move_y = 0;
        this.speed = 2;
        this.i = 0;
    }

    draw(ctx, spriteName, enemy2SpriteManager) {
        enemy2SpriteManager.drawSprite(ctx, spriteName, this.pos_x, this.pos_y);
    }

    // changeMove() {
    //     if (this.move_x === 1) {
    //         this.move_x = -1;
    //     }
    //     else {
    //         this.move_x = 1;
    //     }
    // }
    
    // update(mapManager, gameManager, eventManager) {
    //     if (this.i % 23 === 0) {
    //         this.changeMove();
    //     }
    //     this.i += 1;

    //     PhysicsManager.update(this, mapManager, gameManager, eventManager);
    // }

    //*Уничтожение объекта
    kill(gameManager) {
        gameManager.kill(this);
    }
}