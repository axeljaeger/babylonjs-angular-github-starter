import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

import { Scene } from '@babylonjs/core/scene';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';

import '@babylonjs/core/Materials/standardMaterial';

// import { Inspector } from '@babylonjs/inspector';

@Directive({
  selector: 'canvas[babylonCanvas]'
})
export class BabylonCanvas implements OnInit, OnDestroy {
  private hostRef = inject(ElementRef);

  private engine = new Engine(this.hostRef.nativeElement, true);
  private scene = new Scene(this.engine);
  private resizeObserver = new ResizeObserver(() => this.resizeRequired = true);
  private resizeRequired = true;

  ngOnInit() {
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
    camera.setTarget(Vector3.Zero());

    camera.attachControl(this.hostRef.nativeElement, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;

    const sphere = CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
    sphere.position.y = 1;
    CreateGround("ground", { width: 6, height: 6 }, this.scene);

    this.engine.runRenderLoop(() => {
      if (this.resizeRequired) {
        this.engine?.resize(true);
        this.resizeRequired = false;
      }
      this.scene.render();
    });
    this.resizeObserver.observe(this.hostRef.nativeElement);
  };

  ngOnDestroy(): void {
    this.engine?.stopRenderLoop();
    this.engine?.dispose();
    this.resizeObserver.unobserve(this.hostRef.nativeElement);
  }
}
