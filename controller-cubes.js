import * as THREE from 'three';

export class ControllerCubes {
    constructor() {
        this.cubes = {
            left: null,
            right: null
        };
        this.createCubes();
    }

    createCubes() {
        // Make cubes larger and more visible
        const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const materialLeft = new THREE.MeshPhongMaterial({
            color: 0x0000ff,
            emissive: 0x000066,
            transparent: true,
            opacity: 0.95
        });
        const materialRight = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x660000,
            transparent: true,
            opacity: 0.95
        });

        this.cubes.left = new THREE.Mesh(geometry, materialLeft);
        this.cubes.right = new THREE.Mesh(geometry, materialRight);

        // Add socket points for rays
        this.cubes.left.socketPoint = new THREE.Vector3(0, 0, -0.125);
        this.cubes.right.socketPoint = new THREE.Vector3(0, 0, -0.125);

        // Add visual indicators for orientation
        this.addDirectionIndicator(this.cubes.left, materialLeft);
        this.addDirectionIndicator(this.cubes.right, materialRight);

        // Add position trails
        this.addPositionTrail(this.cubes.left, 0x0000ff);
        this.addPositionTrail(this.cubes.right, 0xff0000);
    }

    addDirectionIndicator(cube, material) {
        // Add a larger arrow to show direction
        const arrowGeometry = new THREE.ConeGeometry(0.05, 0.1, 8);
        const arrow = new THREE.Mesh(arrowGeometry, material);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.z = -0.15;
        cube.add(arrow);
    }

    addPositionTrail(cube, color) {
        // Add a trail effect to show movement
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(30 * 3); // 10 points * 3 coordinates
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const trailMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        cube.add(trail);
        cube.trail = trail;
    }

    attachToControllers(controllerLeft, controllerRight) {
        controllerLeft.add(this.cubes.left);
        controllerRight.add(this.cubes.right);
    }

    getSocketPoint(side) {
        return this.cubes[side].socketPoint;
    }

    getCube(side) {
        return this.cubes[side];
    }
} 