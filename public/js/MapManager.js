export default class MapManager {
    constructor() {
        //*Переменная для хранения карты
        this.mapData = null;
        //tLayer = null;
        //*Ссылки на блоки карты
        this.tLayer = [];
        //*Кол-во блоков по горизонтали и вертикали
        this.xCount = 0;
        this.yCount = 0;
        //*Размер тайла
        this.tSize = {x: 64, y: 64}; 
        //*Размер карты
        this.mapSize = {x: 512, y: 1920};
        //*Массив описаний блоков карты (номер, размеры, коориднаты и тд)
        this.tilesets = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        //*Размер видимой части карты
        this.view = {x: 0, y: 0, w: 750, h: 512};
        this.maps = [];
    }
    
    setManagers(gameManager, playerSpriteManager, coinSpriteManager, doorSpriteManager, exitSpriteManager, enemy1SpriteManager, enemy2SpriteManager, soundManager) {
        this.gameManager = gameManager;
        this.playerSpriteManager = playerSpriteManager;
        this.coinSpriteManager = coinSpriteManager;
        this.doorSpriteManager = doorSpriteManager;
        this.exitSpriteManager = exitSpriteManager;
        this.enemy1SpriteManager = enemy1SpriteManager;
        this.enemy2SpriteManager = enemy2SpriteManager;
        this.soundManager = soundManager;
    }

    isVisible(x, y, width, height) {
        return !(x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h);
    }
    
    loadMap(path) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        //*Отправка запроса на сервер для получения JSON-карты
        request.send();
    }

    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        for (let i = 0;i < this.mapData.tilesets.length; i++){
            let img = new Image();
            img.onload = () => {
                this.imgLoadCount++;
                if (this.imgLoadCount === this.mapData.tilesets.length){
                    this.imgLoaded = true;
                }
            }
            //*Путь к изображению
            img.src = this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];
            //*Свой объект tileset
            let ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y),
            };
            //*Записываем его в массив
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }

    draw(ctx) {
        //*Если карта не загружена, повторить через 100мс
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.draw(ctx);
            }, 100);
        }
        else {
            if (this.tLayer.length === 0){
                for (let id = 0;id < this.mapData.layers.length; id++){
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer"){
                        this.tLayer.push(layer);
                    }
                }
            }
            for (let j = 0; j < this.tLayer.length; j++){
                for (let i = 0; i < this.tLayer[j].data.length; i++){
                    if (this.tLayer[j].data[i] !== 0) {
                        let tile = this.getTile(this.tLayer[j].data[i]);
                        let pX = (i % this.xCount)* this.tSize.x;
                        let pY = Math.floor(i/this.xCount)*this.tSize.y;
                        if (!this.isVisible(pX,pY,this.tSize.x,this.tSize.y))
                            continue
                        pX -= this.view.x;
                        pY -= this.view.y;
                        ctx.drawImage(
                            tile.img,
                            tile.px,
                            tile.py,
                            this.tSize.x,
                            this.tSize.y,
                            pX,
                            pY,
                            this.tSize.x,
                            this.tSize.y
                        );
                    }
                }
            }
        }
    }
    
    getTile (tileIndex) {  
        let tile = {
            img: null,
            px: 0, 
            py: 0 
        }
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset (tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--) {
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }
        return null;  
    }
    //*разбор слоя objectgroup
    parseEntities(){
        if (!this.imgLoaded || !this.jsonLoaded){
            setTimeout(()=>{
                this.parseEntities();
            },100);
        } 
        else {
            for (let j = 0; j < this.mapData.layers.length; j++)
                if (this.mapData.layers[j].type === 'objectgroup'){
                    let entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++){
                        let e = entities.objects[i];
                        try {
                            //*Создаем экземпляр объекта
                            let obj = new this.gameManager.factory[e.class]();
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y - e.height;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            obj.gameManager = this.gameManager;
        
                            // if(obj.type === "enemy"){
                            //     this.enemies.push(obj);
                            //     this.endMove.push(true);
                            // }
                            if (obj.name === 'player') {
                                this.gameManager.initPlayer(obj);
                            }
                            this.gameManager.entities.push(obj);
                        } catch (ex){
                            console.log(`Error while creating: [${e.gid}] ${e.class}, ${ex}`)
                        }
                    }
                }
        }
    }
    
    //*Функция возвращает блок из массива data с индексом idx.
    getTilesetIdx(x,y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer[1].data[idx];
    }

    centerAt(x, y) {
        if (x < this.view.w / 2)
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);
    }
}

