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
            //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, this._scene);
            
            // helper lines to show axis
            this.showAxis();
            
            //register resize event
            this.initWindowsResizeEvent();

            //init key presses event
            this.initKeyPressEvent();

            //debug
            scene.debugLayer.show();

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
            sphere.convertToUnIndexedMesh();
            sphere.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;
            // give sphere a color
            var myMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
            myMaterial.diffuseColor =  new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.specularColor = new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.emissiveColor = new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            myMaterial.ambientColor =  new BABYLON.Color3(this.randomFloatUnderOne(), this.randomFloatUnderOne(), this.randomFloatUnderOne());
            sphere.material = myMaterial;

            // attach particles to sphere
            var particleSystem = this.attachParticleSystem(sphere);

            //make sphere move
            var i = 0;
            var direction = new BABYLON.Vector3(0, this.randomFloatUnderOne(), 0);
            direction.normalize();
            let distance = 0.1;

            scene.registerAfterRender( () => {
                //var particleSystem = new BABYLON.ParticleSystem("particles", 1, scene);
                //var explosionSphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2.5 }, scene);

                let fireworkLifetime = this.randomInt(100,250);
                if(i++ < fireworkLifetime) {
                    sphere.translate(direction, distance, BABYLON.Space.WORLD);
                }else if(i++ < fireworkLifetime + 150){
                    //Texture of each particle
                    //particleSystem.particleTexture = new BABYLON.Texture("flare.png", scene);
                    // Where the particles come from
                    particleSystem.emitter = sphere; //new BABYLON.Vector3(0, 0, 0); // the starting object, the emitter
                    particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2); // Starting all from
                    particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2); // To...
                    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

                    particleSystem.emitRate = 20;

                    // Size of each particle (random between...
                    particleSystem.minSize = 0.5;
                    particleSystem.maxSize = 0.9;

                    // Life time of each particle (random between...
                    particleSystem.minLifeTime = 0.2;
                    particleSystem.maxLifeTime = 0.6;

                    // explosionSphere.position = sphere.position;
                    this.createFireworksExplosion(sphere);
                    particleSystem.start();
                }else{
                    sphere.dispose();
                    sphere.material?.dispose();
                    //particleSystem.stop();
                }
            });
        }

        private createFireworksExplosion(sphere : BABYLON.Mesh){
            let scene = this._scene;
            BABYLON.Effect.ShadersStore["customVertexShader"] = "\r\n" +
                "precision highp float;\r\n" +

                "// Attributes\r\n" +
                "attribute vec3 position;\r\n" +
                "attribute vec3 normal;\r\n" +

                "// Uniforms\r\n" +
                "uniform mat4 worldViewProjection;\r\n" +
                "uniform float time;\r\n" +
                "uniform float r;\r\n" +
                "uniform float g;\r\n" +
                "uniform float b;\r\n" +

                "void main(void) {\r\n" +
                "    vec3 p = position;\r\n" +
                "    vec3 j = vec3(0., -1.0, 0.);\r\n" +
                "    p = p + normal * log2(1. + time) * 2.5;\r\n" +
                "    gl_Position = worldViewProjection * vec4(p, 1.0);\r\n" +
                "}\r\n";

            BABYLON.Effect.ShadersStore["customFragmentShader"] = "\r\n" +
                "precision highp float;\r\n" +

                "uniform float time;\r\n" +
                "uniform float r;\r\n" +
                "uniform float g;\r\n" +
                "uniform float b;\r\n" +
                
                "void main(void) {\r\n" +
                "    gl_FragColor = vec4(r, g, b, 1.0 );\r\n" +
                "}\r\n";



            var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
                vertex: "custom",
                fragment: "custom",
            },
                {
                    attributes: ["position", "normal", "uv", "color"],
                    uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
                    needAlphaBlending: true
                });


            shaderMaterial.backFaceCulling = false;

            //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
            sphere.scaling = new BABYLON.Vector3(2,2,2);
            sphere.convertToFlatShadedMesh();
            sphere.material = shaderMaterial;
            
            var t = 0.0;
            var time = 0.0;
            scene.registerBeforeRender( ()  => {
                if (time < 8) {
                    sphere.material.setFloat("position", sphere.position);
                    sphere.material.setFloat("r", this.randomFloatUnderOne());
                    sphere.material.setFloat("g", this.randomFloatUnderOne());
                    sphere.material.setFloat("b", this.randomFloatUnderOne());

                    sphere.material.setFloat("time", time);
                    time += 0.1;
                }
                else {
                    sphere.dispose();
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
            return particleSystem;
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




