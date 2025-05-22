import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ControllerCubes } from './controller-cubes.js';
import { ControllerRays } from './controller-rays.js';

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster = new THREE.Raycaster();
let intersected;
let canvasPanel;
let isInVR = false;
let currentSession = null;
let controllerCubes, controllerRays;
let moveSpeed = 0.1;
let rotateSpeed = 0.02;
let keys = {};

function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    console.log(text);
}

function createCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const context = canvas.getContext('2d');

    // Fill canvas with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add some text
    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillText('Interactive VR Canvas', canvas.width/2, canvas.height/2);
    context.font = '16px Arial';
    context.fillText('Use controller to interact', canvas.width/2, canvas.height/2 + 30);

    return canvas;
}

function createControllerModel(index) {
    const group = new THREE.Group();
    
    // Controller body
    const bodyGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: index === 0 ? 0xff0000 : 0x0000ff,
        emissive: 0x101010,
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Trigger button
    const buttonGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
    const buttonMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        emissive: 0x101010
    });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.z = -0.08;
    button.position.y = 0.03;
    group.add(button);

    return group;
}

function addControllerMesh(controller, controllerGrip, index) {
    // Add position indicator sphere
    const sphereGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: index === 0 ? 0xff0000 : 0x0000ff,
        emissive: index === 0 ? 0x330000 : 0x000033,
        transparent: true,
        opacity: 0.7
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    controller.add(sphere);
}

async function init() {
    // Check WebXR support
    if (!('xr' in navigator)) {
        showMessage('WebXR not available');
        return;
    }

    try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (!isSupported) {
            showMessage('VR not supported');
            return;
        }
    } catch (err) {
        showMessage('Error checking VR support: ' + err.message);
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Camera setup
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Create canvas panel
    const canvasTexture = new THREE.CanvasTexture(createCanvasTexture());
    const panelGeometry = new THREE.PlaneGeometry(3.2, 1.8); // Scaled up from 320x180
    const panelMaterial = new THREE.MeshPhongMaterial({
        map: canvasTexture,
        side: THREE.DoubleSide
    });
    canvasPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    canvasPanel.position.set(0, 1.6, -2);
    scene.add(canvasPanel);

    // Initialize controller components
    controllerCubes = new ControllerCubes();
    controllerRays = new ControllerRays();

    // Controllers setup
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    scene.add(controllerGrip2);

    // Attach cubes and rays
    controllerCubes.attachToControllers(controller2, controller1); // Note: 2 is left, 1 is right
    controllerRays.attachToParents(controllerCubes.getCube('left'), controllerCubes.getCube('right'));

    // Add basic controller meshes
    addControllerMesh(controller1, controllerGrip1, 0);
    addControllerMesh(controller2, controllerGrip2, 1);

    // VR Button setup
    const button = document.getElementById('enterVRButton');
    button.addEventListener('click', async () => {
        try {
            if (currentSession === null) {
                const session = await navigator.xr.requestSession('immersive-vr', {
                    optionalFeatures: ['local-floor', 'bounded-floor']
                });
                
                session.addEventListener('end', () => {
                    currentSession = null;
                    isInVR = false;
                    button.textContent = 'Enter VR';
                    showMessage('Exited VR mode');
                });
                
                await renderer.xr.setSession(session);
                currentSession = session;
                isInVR = true;
                button.textContent = 'Exit VR';
                showMessage('Entered VR mode');
            } else {
                await currentSession.end();
            }
        } catch (err) {
            showMessage('Error entering VR: ' + err.message);
            console.error('VR Error:', err);
        }
    });

    // Window resize handler
    window.addEventListener('resize', onWindowResize);

    // Add keyboard controls
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Start animation loop
    renderer.setAnimationLoop(animate);

    showMessage('Ready! Click "Enter VR" to start');
}

function onWindowResize() {
    if (!currentSession) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function onSelectStart(event) {
    if (!isInVR) return;

    const controller = event.target;
    const side = controller === controller2 ? 'left' : 'right';
    
    if (side === 'left') {
        controllerRays.onTriggerPressed(side);
    }

    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        intersected = intersection.object;
        console.log('Canvas panel clicked at:', intersection.point);
    }
}

function onSelectEnd(event) {
    if (!isInVR) return;
    
    const controller = event.target;
    const side = controller === controller2 ? 'left' : 'right';
    
    if (side === 'left') {
        controllerRays.onTriggerReleased(side);
    }
    
    intersected = null;
}

function getIntersections(controller) {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObject(canvasPanel);
}

function handleMovement() {
    if (!isInVR || !camera) return;

    // Forward/Backward
    if (keys['w']) camera.position.z -= moveSpeed;
    if (keys['s']) camera.position.z += moveSpeed;

    // Left/Right
    if (keys['a']) camera.position.x -= moveSpeed;
    if (keys['d']) camera.position.x += moveSpeed;

    // Up/Down
    if (keys['q']) camera.position.y -= moveSpeed;
    if (keys['e']) camera.position.y += moveSpeed;

    // Rotation
    if (keys['arrowleft']) camera.rotation.y += rotateSpeed;
    if (keys['arrowright']) camera.rotation.y -= rotateSpeed;
    if (keys['arrowup']) camera.rotation.x += rotateSpeed;
    if (keys['arrowdown']) camera.rotation.x -= rotateSpeed;
}

function animate() {
    if (isInVR) {
        handleMovement();

        // Check for controller intersections
        const intersections1 = getIntersections(controller1);
        const intersections2 = getIntersections(controller2);

        // Update visual feedback for intersections
        [controller1, controller2].forEach((controller, index) => {
            const line = controller.getObjectByName('pointer');
            if (line) {
                const intersections = index === 0 ? intersections1 : intersections2;
                line.material.opacity = intersections.length > 0 ? 1 : 0.5;
            }
        });
    }

    renderer.render(scene, camera);
}

// Initialize the scene
init(); 