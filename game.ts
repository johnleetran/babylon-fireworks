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

        }

        private initCamera(){
            // Add a camera to the scene and attach it to the canvas
            var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), this._scene);
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




