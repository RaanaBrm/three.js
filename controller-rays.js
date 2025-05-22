import * as THREE from 'three';

export class ControllerRays {
    constructor() {
        this.rays = {
            left: null,
            right: null
        };
        this.defaultColors = {
            left: 0x0000ff,
            right: 0xff0000
        };
        this.activeColor = 0x00ff00;
        this.createRays();
    }

    createRays() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));

        // Create rays for both controllers
        ['left', 'right'].forEach(side => {
            const material = new THREE.LineBasicMaterial({
                color: this.defaultColors[side],
                transparent: true,
                opacity: 0.9,
                linewidth: 3
            });
            this.rays[side] = new THREE.Line(geometry, material);
            this.rays[side].scale.z = 10;
        });
    }

    attachToParents(leftParent, rightParent) {
        leftParent.add(this.rays.left);
        rightParent.add(this.rays.right);
    }

    onTriggerPressed(side) {
        if (side === 'left') {
            this.rays.left.material.color.setHex(this.activeColor);
            this.rays.left.material.linewidth = 5;
            this.rays.left.material.opacity = 1;
        }
    }

    onTriggerReleased(side) {
        if (side === 'left') {
            this.rays.left.material.color.setHex(this.defaultColors[side]);
            this.rays.left.material.linewidth = 3;
            this.rays.left.material.opacity = 0.9;
        }
    }

    getRay(side) {
        return this.rays[side];
    }
} 