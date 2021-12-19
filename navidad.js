let player_config = {
    player_speed: 150,
    player_jumpspeed: -600,
}

let config ={
    type: Phaser.AUTO,
    scale: {
        //tamaño de la ventana 
        width: 1820,
        height: 650,
    },
    backgroundColor: '#1e3c72',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800,
            },
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
        
};

let game = new Phaser.Game(config);

function preload(){ //se cargan las imagenes
    this.load.image("back","assets/backMario.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("arbol","assets/arbol.png");
    this.load.image("tarjeta","assets/tarjetaNavidad.png");
    this.load.image("santa","assets/santa.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("nubes", "assets/nubes.png");
    this.load.image("nube", "assets/nube.png");
    this.load.image("deco-mario", "assets/mario_navidad.png");
    this.load.image("adorno", "assets/adorno.png");
    this.load.image("bloque","assets/bloque.png");
    this.load.image("sorprise", "assets/sorprise.png");
    this.load.image("mensaje", "assets/imagen_prueba.png");
    //Inserta tu foto aquí
    //this.load.image("nombre_variable", "nombre_carpeta/nombre_archivo.png(también puede estar en.jpg)")


    
    //Dinamicidad del personaje
    this.load.spritesheet("mario", "assets/spriteMario.png",{
        frameWidth:60,
        frameHeight:95,
    });
}

function create(){
    W = game.config.width;
    H = game.config.height;

    this.add.tileSprite(700,629,1000,700,'back').setScale(1.5,1.5);
    this.add.sprite(900,250,"santa").setScale(0.7,0.7);
    this.add.sprite(810,410,"arbol").setScale(0.1,0.1);  
    this.add.sprite(1220,310,"tarjeta").setScale(0.2,0.2);
    //CAMBIA AQUÍ EL NOMBRE DE LA IMAGEN PARA AGREGARLA
    this.add.sprite(1600,410,"mensaje").setScale(0.7,0.7);
    let ground = this.add.tileSprite(0, H-20,W,30,'ground');
    ground.setOrigin(0,0);
    this.physics.add.existing(ground, true);   
    let adorno = this.add.tileSprite(690,H-550,W,200,"adorno");
    
    
    let nube = this.physics.add.staticGroup();
    nube.create(150, 300, "nube").setScale(0.6,0.6);
    nube.create(680, 350, "nube").setScale(0.5,0.5);
    nube.create(950, 400, "nube").setScale(0.4,0.4);
    let deco1 = this.add.sprite(400,300,"deco-mario").setScale(0.8,0.8);

    //agregar a mario a la escena
    this.player = this.physics.add.sprite(40,0,"mario",0);
    this.player.setBounce(0.3)
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mario', {
            start: 13, end: 8,
        }),
            frameRate: 10, //indica las veces que se repite la animacion
            repate: -1
    })

    this.anims.create({
        key: 'center',
        frames: this.anims.generateFrameNumbers('mario', {
            start: 0, end: 0
        }),
        frameRate: 10
    })

    this.anims.create({

        key: 'rigth',
        frames: this.anims.generateFrameNumbers('mario', {
            start: 1, end:6
        }),
        frameRate: 15,
        repate: -1
    })

    this.cursors = this.input.keyboard.createCursorKeys();

    let coins = this.physics.add.group({
        key:"coin",
        repeat: 8,
        seScale: {x:0.05, y:0.05},
        setXY:{x:200, y:0, stepX: 100},

    })

    coins.children.iterate((f) => {
        f.setBounce(Phaser.Math.FloatBetween(0.3, 0.5))
    })

    let blocks = this.physics.add.staticGroup();
    
    blocks.create(360, 490, "bloque").refreshBody();
    blocks.create(400, 490, "bloque").refreshBody();
    blocks.create(440, 490, "bloque").refreshBody();
    blocks.create(590, 370, "bloque").refreshBody();
    blocks.create(630, 370, "bloque").refreshBody();
    blocks.create(770, 490, "bloque").refreshBody();
    blocks.create(810, 490, "bloque").refreshBody();
    blocks.create(850, 490, "bloque").refreshBody();
    blocks.create(1220, 490, "sorprise").refreshBody();

    let platforms = this.physics.add.staticGroup();
    platforms.add(ground);

    this.physics.add.collider(platforms, this.player)
    this.physics.add.collider(platforms, coins);
    this.physics.add.collider(blocks, coins);
    this.physics.add.overlap(this.player, coins, eatCoin, null, this);
    this.physics.add.collider(this.player, blocks);

    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);

    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.3);

}

function update(){
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left', true)
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('rigth', true)
    }
    else {
        this.player.setVelocityX(0);
        this.player.anims.play('center', 'true')
    }

    //habilidad de salto
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(player_config.player_jumpspeed)
    }
}
function eatCoin(player, coin) {
    coin.disableBody(true, true)
}
