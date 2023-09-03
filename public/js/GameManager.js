import {Player, Entity, Coin, Door, Exit, Enemy1, Enemy2} from "./Entities.js";
import MapManager from "./MapManager.js";
import SpriteManager from "./SpriteManager.js";
import EventManager from "./EventManager.js";
import PhysicsManager from "./PhysicsManager.js";
import SoundManager from "./SoundManager.js";

export default class GameManager {
    constructor(ctx) {
        this.factory = {};
        this.entities = [];
        this.enemyCount = 0;
        this.player = null;
        this.laterKill = [];
        this.level = 1;
        this.gameFPS = 50;
        this.ctx = ctx;
    }

    initPlayer(obj){
        this.player = obj;
    }

    kill(obj){
        this.laterKill.push(obj);
    }

    setManagers(mapManager, playerSpriteManager, coinSpriteManager, eventManager, physicsManager, doorSpriteManager, exitSpriteManager, enemy1SpriteManager, enemy2SpriteManager, soundManager) {
        this.mapManager = mapManager;
        this.playerSpriteManager = playerSpriteManager;
        this.coinSpriteManager = coinSpriteManager;
        this.eventManager = eventManager;
        this.physicsManager = physicsManager;
        this.doorSpriteManager = doorSpriteManager;
        this.exitSpriteManager = exitSpriteManager;
        this.enemy1SpriteManager = enemy1SpriteManager;
        this.enemy2SpriteManager = enemy2SpriteManager;
        this.soundManager = soundManager;

        this.mapManager.setManagers(this, this.playerSpriteManager, this.coinSpriteManage, this.doorSpriteManager, this.exitSpriteManager, this.enemy1SpriteManager, this.enemy2SpriteManager, this.soundManager);
        this.playerSpriteManager.setManagers(mapManager);
        this.coinSpriteManager.setManagers(mapManager);
        this.doorSpriteManager.setManagers(mapManager);
        this.exitSpriteManager.setManagers(mapManager);
        this.enemy1SpriteManager.setManagers(mapManager);
        this.enemy2SpriteManager.setManagers(mapManager);

    }

    update() {
        if (this.player === null) {
            return;
        }
        this.player.move_x = 0;
        // this.player.move_y = 0;
        if (this.eventManager.action['jump'] && !this.player.is_jump) {
            this.player.jump();
        }
        if (this.eventManager.action['left']) {
            this.player.move_x = -1;
        }
        if (this.eventManager.action['right']) {
            this.player.move_x = 1;
        }
        this.entities.forEach((e) => {
            e.update(this.mapManager, this, this.eventManager);
            // try {
            //     e.update(this.mapManager, this);
            // } catch (ex) {
            //     console.log(`Error of update: ${ex}`)
            // }
        });

        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }

        if (this.laterKill.length > 0) {
            this.laterKill.length = 0;
        }
        this.mapManager.draw(this.ctx);
        this.mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(this.ctx);
    }

    draw(ctx){
        for (let e = 0; e < this.entities.length; e++) {
            if(this.entities[e].name == 'player') {
                this.entities[e].draw(ctx, this.entities[e].name, this.playerSpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
            if(this.entities[e].name == 'coin') {
                this.entities[e].draw(ctx, this.entities[e].name, this.coinSpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
            if(this.entities[e].name == 'door') {
                this.entities[e].draw(ctx, this.entities[e].name, this.doorSpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
            if(this.entities[e].name == 'exit') {
                this.entities[e].draw(ctx, this.entities[e].name, this.exitSpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
            if(this.entities[e].name == 'enemy1') {
                this.entities[e].draw(ctx, this.entities[e].name, this.enemy1SpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
            if(this.entities[e].name == 'enemy2') {
                this.entities[e].draw(ctx, this.entities[e].name, this.enemy2SpriteManager, this.entities[e].pos_x, this.entities[e].pos_x);
            }
        }
    }

    loadAll(canvas, body) {
        this.mapManager.loadMap("public/map.json");
        this.playerSpriteManager.loadAtlas('public/assets/player.json', 'public/assets/player.png');
        this.coinSpriteManager.loadAtlas('public/assets/coin.json', 'public/assets/coin.png');
        this.doorSpriteManager.loadAtlas('public/assets/door.json', 'public/assets/door.png');
        this.enemy1SpriteManager.loadAtlas('public/assets/enemy1.json', 'public/assets/enemy1.png');
        this.enemy2SpriteManager.loadAtlas('public/assets/enemy2.json', 'public/assets/enemy2.png');
        this.soundManager.loadArray(["/public/sounds/theme.mp3", "/public/sounds/coin.mp3", "/public/sounds/loss.mp3", "/public/sounds/win.mp3"]);
        this.factory['Player'] = Player;
        this.factory['Coin'] = Coin;
        this.factory['Door'] = Door;
        this.factory['Enemy1'] = Enemy1;
        this.factory['Enemy2'] = Enemy2;

        this.mapManager.parseEntities();
        this.mapManager.draw(this.ctx);
        this.eventManager.setup(canvas, body);
        this.canvas = canvas;
        this.body = body;
        this.play();  
    }

    level2(canvas, body) {
        this.clearMap();
        this.mapManager.loadMap("public/map2.json");
        this.playerSpriteManager.loadAtlas('public/assets/player.json', 'public/assets/player.png');
        this.coinSpriteManager.loadAtlas('public/assets/coin.json', 'public/assets/coin.png');
        this.exitSpriteManager.loadAtlas('public/assets/exit.json', 'public/assets/exit.png');
        this.enemy1SpriteManager.loadAtlas('public/assets/enemy1.json', 'public/assets/enemy1.png');
        this.enemy2SpriteManager.loadAtlas('public/assets/enemy2.json', 'public/assets/enemy2.png');
        this.soundManager.loadArray(["/public/sounds/theme.mp3", "/public/sounds/coin.mp3", "/public/sounds/loss.mp3", "/public/sounds/win.mp3"]);
        this.factory['Player'] = Player;
        this.factory['Coin'] = Coin;
        this.factory['Exit'] = Exit;
        this.factory['Enemy1'] = Enemy1;
        this.factory['Enemy2'] = Enemy2;

        this.mapManager.parseEntities();
        this.mapManager.draw(this.ctx);
        this.eventManager.setup(canvas, body);
        this.canvas = canvas;
        this.body = body;
        this.play();
    }

    clearMap(){
        clearInterval(this.interval);
        this.entities = [];
        this.setManagers (
            new MapManager(),
            new SpriteManager(),
            new SpriteManager(),
            new EventManager(),
            new PhysicsManager(),
            new SpriteManager(),
            new SpriteManager(),
            new SpriteManager(),
            new SpriteManager(),
            new SoundManager()
        );
    }

    play(){
        this.interval = setInterval(() => {
            this.update();
        }, this.gameFPS);
    }
}
