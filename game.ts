import * as BABYLON from 'babylonjs';

module GAME{
    export class Game{

        private _canvas: HTMLCanvasElement;
		private _engine: BABYLON.Engine;
        private _scene: BABYLON.Scene;
        private _camera: BABYLON.Camera;

        constructor(){
            var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
            var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            var scene = new BABYLON.Scene(engine);

            this._engine = engine;
            this._canvas = canvas;
            this._scene = scene;

            this._camera = this.initCamera();
    
            // Add lights to the scene
            this.initLights();

            // Add and manipulate meshes in the scene
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, this._scene);
            
            // helper lines to show axis
            this.showAxis();
            
            //register resize event
            this.initWindowsResizeEvent();

            //init key presses event
            this.initKeyPressEvent();

        }

        private initKeyPressEvent(){
            let scene = this._scene;
            scene.onKeyboardObservable.add((evt) => {
                switch (evt.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:          
        
                        switch (evt.event.key) {
                            case "a": // passt
                            case "A":
                                console.log('a');
                                BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
                                    set.systems.forEach(s => {
                                        s.disposeOnStop = true;
                                    });
                                    set.start();
                                });
                                break;                        
                            case "d": // passt
                            case "D":
                                console.log('d');
                                break;
                            case "w": // passt
                            case "W":
                                console.log('w');
                                break;
                            case "s": // passt
                            case "S":
                                console.log('s');
                                this.createSphere();
                                break;                                                                              
                         };
                        break;
                };
            });
        }

        private createSphere(){
            let scene = this._scene;
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:.25}, this._scene);
            sphere.position.x = this.randomInt(-20, 20);

            // give sphere a color
            var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
            myMaterial.diffuseColor =  new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.specularColor = new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.emissiveColor = new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.ambientColor =  new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            sphere.material = myMaterial;

            // attach particles to sphere
            this.attachParticleSystem(sphere);

            //make sphere move
            var i = 0;
            var direction = new BABYLON.Vector3(0, this.randomFloatUnderOne(), 0);
            direction.normalize();
            let distance = 0.1;
            var explosionSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:.01}, scene);

            scene.registerAfterRender( () => {
                var particleSystem = new BABYLON.ParticleSystem("particles", 20, scene);
                let fireworkLifetime = this.randomInt(100,250);
                if(i++ < fireworkLifetime) {
                    sphere.translate(direction, distance, BABYLON.Space.WORLD);
                }else if(i++ < fireworkLifetime + 150){
                    //Texture of each particle
                    particleSystem.particleTexture = new BABYLON.Texture("flare.png", scene);
                    // Where the particles come from
                    particleSystem.emitter = explosionSphere; //new BABYLON.Vector3(0, 0, 0); // the starting object, the emitter
                    particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2); // Starting all from
                    particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2); // To...
                    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                    particleSystem.emitRate = 200;

                    // Size of each particle (random between...
                    particleSystem.minSize = 0.5;
                    particleSystem.maxSize = 0.9;

                    // Life time of each particle (random between...
                    particleSystem.minLifeTime = 0.2;
                    particleSystem.maxLifeTime = 0.6;

                    explosionSphere.position = sphere.position;
                    sphere.scaling = new BABYLON.Vector3(1.25,1.25,1.25);
                    sphere.dispose();
                    particleSystem.start();
                }else{
                    explosionSphere.dispose();
                    particleSystem.stop();
                }
            });
        }

        private attachParticleSystem(mesh: BABYLON.Mesh){
            let scene =this._scene;
            var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            //Texture of each particle
            particleSystem.particleTexture = new BABYLON.Texture("flare.png", scene);

            // Where the particles come from
            particleSystem.emitter = mesh; //new BABYLON.Vector3(0, 0, 0); // the starting object, the emitter
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2); // To...

            
            // Size of each particle (random between...
            particleSystem.minSize = 0.01;
            particleSystem.maxSize = 0.1;

            // Life time of each particle (random between...
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;

            // Emission rate
            particleSystem.emitRate = 2500;

            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            // Set the gravity of all particles
            particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

            // Direction of each particle after it has been emitted
            particleSystem.direction1 = new BABYLON.Vector3(-1, -1, 3);
            particleSystem.direction2 = new BABYLON.Vector3(1, -1, -3);

            // Angular speed, in radians
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;

            // Speed
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            particleSystem.updateSpeed = 0.005;
            particleSystem.start();
        }

        private randomInt(min: number, max: number){
            return Math.floor(Math.random() * (max - min) ) + min;
        }

        private randomFloatUnderOnePositiveOrNegative(){
            var tmp = this.randomInt(0,2)
            var sign = 1;
            if(tmp === 1) {
                sign = -1
            }
            return this.randomFloatUnderOne() * sign;
        }

        private randomFloatUnderOne(){
            return Math.random();
        }


        private initCamera(){
            // Add a camera to the scene and attach it to the canvas
            var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -50), this._scene);
            //var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), this._scene);
            camera.attachControl(this._canvas, true);
            return camera;
        }

        private initLights(){
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this._scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), this._scene);
        }

        private initWindowsResizeEvent(){
            // Watch for browser/canvas resize events
            window.addEventListener("resize", () => {
                this._engine.resize();
            });
        }

        private showAxis(){
            //Array of points to construct lines
            var xAxisPoints = [
                new BABYLON.Vector3(1000, 0, 0),
                new BABYLON.Vector3(-1000, 0, 0),
            ];
            var yAxisPoints = [
                new BABYLON.Vector3(0, 1000, 0),
                new BABYLON.Vector3(0, -1000, 0),
            ];            
            var zAxisPoints = [
                new BABYLON.Vector3(0, 0, 1000),
                new BABYLON.Vector3(0, 0, -1000),
            ];

            //Create lines 
            var red = new BABYLON.Color3(1,0,0);
            var green = new BABYLON.Color3(0,1,0);
            var blue = new BABYLON.Color3(0,0,1);

            var xLines = BABYLON.MeshBuilder.CreateLines("xAxis", {points: xAxisPoints}, this._scene); 
            var yLines = BABYLON.MeshBuilder.CreateLines("yAxis", {points: yAxisPoints}, this._scene); 
            var zLines = BABYLON.MeshBuilder.CreateLines("zAxis", {points: zAxisPoints}, this._scene); 
            xLines.color = red;
            yLines.color = green;
            zLines.color = blue;
        }
        public runRenderLoop(){
            this._engine.runRenderLoop( () => {
                this._scene.render();
            });
        }
    }
}
function runGame() {
    let game = new GAME.Game();
    game.runRenderLoop();
}

runGame();




