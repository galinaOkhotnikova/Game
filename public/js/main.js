import MapManager from "./MapManager.js";
import SpriteManager from "./SpriteManager.js";
import GameManager from "./GameManager.js";
import EventManager from "./EventManager.js";
import PhysicsManager from "./PhysicsManager.js";
import SoundManager from "./SoundManager.js";

let canvas = document.getElementById('game__field');
let ctx = canvas.getContext('2d');
let body = document.body;

let mapManager = new MapManager();
let gameManager = new GameManager(ctx);
let playerSpriteManager = new SpriteManager();
let coinSpriteMnager = new SpriteManager();
let doorSpriteManager = new SpriteManager();
let exitSpriteManager = new SpriteManager();
let enemy1SpriteManager = new SpriteManager();
let enemy2SpriteManager = new SpriteManager();
let eventManager = new EventManager();
let physicsManager = new PhysicsManager();
let soundManager = new SoundManager();

gameManager.setManagers(mapManager, playerSpriteManager, coinSpriteMnager, eventManager, physicsManager, doorSpriteManager, enemy1SpriteManager, enemy2SpriteManager, exitSpriteManager, soundManager);
gameManager.loadAll(canvas, body);
gameManager.play();

// !Звуки
// !Движение врагов (сделано криво)