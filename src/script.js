import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
*/
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


// Bar
gltfLoader.load(
    '/models/chocolateBar.glb',
    (bar) => {
        console.log('success')
        console.log(bar)


        bar.scene.position.set(5,5,-5)
        bar.scene.rotation.set(0,Math.PI/2,Math.PI/2)
        
        scene.add(bar.scene)
        camera.lookAt(bar.scene.position);

        bar.scene.receiveShadow = true
        
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)



/**
 * Lights
 */
const directionalLightFront = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLightFront.castShadow = true
directionalLightFront.shadow.mapSize.set(1024, 1024)
directionalLightFront.shadow.camera.far = 15
directionalLightFront.shadow.camera.left = - 7
directionalLightFront.shadow.camera.top = 7
directionalLightFront.shadow.camera.right = 7
directionalLightFront.shadow.camera.bottom = - 7
directionalLightFront.position.set(5, 5, 5)
scene.add(directionalLightFront)

const directionalLightBack = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLightBack.castShadow = true
directionalLightBack.shadow.mapSize.set(1024, 1024)
directionalLightBack.shadow.camera.far = 15
directionalLightBack.shadow.camera.left = - 7
directionalLightBack.shadow.camera.top = 7
directionalLightBack.shadow.camera.right = 7
directionalLightBack.shadow.camera.bottom = - 7
directionalLightBack.position.set(5, 5, -5)
scene.add(directionalLightBack)


// const LightHelper = new THREE.DirectionalLightHelper(directionalLightFront)
// scene.add(LightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(-15, -5, 10)
camera.position.set(0, 25, -5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Define materials
const material = new THREE.MeshLambertMaterial({ color: '#EEE6D9', side: THREE.DoubleSide });

// Define geometry for the nutrition facts plane
const planeWidth = 6;
const planeHeight = 5.5;
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

// Create the nutrition facts plane
const nutritionFactsPlane = new THREE.Mesh(planeGeometry, material);
scene.add(nutritionFactsPlane);

// Add text labels for nutrition facts
const textLoader = new FontLoader();
textLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    // Function to create text mesh
    function createTextMesh(text, position, size) {
        const textGeometry = new TextGeometry(text, {
            font: font,
            size: size,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(position);
        // textMesh.rotation.y = -Math.PI / 2;
        
        return textMesh;
    }

    // Add nutrition facts labels
    const labels = [
        { text: "Nutrition Facts", position: new THREE.Vector3(-2.5, 1.5, 0), size: 0.4 },
        { text: "Serving Size 1 Bar (94g)", position: new THREE.Vector3(-2.5, 1, 0), size: 0.2 },
        { text: "Calories 190", position: new THREE.Vector3(-2.5, 0.5, 0), size: 0.2 },
        { text: "Total Fat 11g", position: new THREE.Vector3(-2.5, 0, 0), size: 0.2 },
        { text: "Sodium 25mg", position: new THREE.Vector3(-2.5, -0.5, 0), size: 0.2 },
        { text: "Total Carbohydrate 22g", position: new THREE.Vector3(-2.5, -1, 0), size: 0.2 },
        { text: "Dietary Fiber 4g", position: new THREE.Vector3(-2.5, -1.5, 0), size: 0.2 },
        { text: "Sugars 12g", position: new THREE.Vector3(-2.5, -2, 0), size: 0.2 },
        { text: "Protein 5.5g", position: new THREE.Vector3(-2.5, -2.5, 0), size: 0.2 }
    ];

    labels.forEach(label => {
        const textMesh = createTextMesh(label.text, label.position, label.size);
        nutritionFactsPlane.add(textMesh);

    });

    nutritionFactsPlane.receiveShadow = true
    
    nutritionFactsPlane.position.set(0, -1, -6.5)
    nutritionFactsPlane.rotation.x = (0);
    nutritionFactsPlane.rotation.y = (Math.PI);
    nutritionFactsPlane.rotation.z = (0);


})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()