if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
let container, camera, cameraTarget, scene, renderer, controls;

init();
animate();
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
    // camera.position.set(3, 0.15, 3);
    camera.position.set(3, 0.15, 3);
    cameraTarget = new THREE.Vector3(0, - 0.1, 0);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x72645b);
    scene.fog = new THREE.Fog(0x72645b, 2, 15);
    // Ground
    let plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(40, 40),
        new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    scene.add(plane);
    plane.receiveShadow = true;

    scene.userData.camera = camera;
    controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    scene.userData.controls = controls;

    // PLY files
    let PLYs = [
        'ply/Parotid_L.ply',
        'ply/Parotid_R.ply',
        'ply/PTV54.ply',
        'ply/PTV60.ply',
        'ply/PTV70.ply',
    ]
    let loader = new THREE.PLYLoader();
    let color;
    PLYs.forEach(file => {
        loader.load(file, function (geometry) {
            if (file.toLowerCase().includes('parotid')) {
                color = 'pink';
            } else if (file.includes('54')) {
                color = 'cyan';
            } else if (file.includes('60')) {
                color = 'blue';
            } else if (file.includes('70')) {
                color = 'red';
            }
            geometry.computeVertexNormals();
            let material = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.6, flatShading: false });
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0;
            mesh.position.z = 0.1;
            mesh.rotation.x = - Math.PI / 2;
            mesh.scale.multiplyScalar(0.005);
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            scene.add(mesh);
        });
    });
    // Lights
    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
    addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);
    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    // // stats
    // stats = new Stats();
    // container.appendChild(stats.dom);
    // resize
    window.addEventListener('resize', onWindowResize, false);
}
function addShadowedLight(x, y, z, color, intensity) {
    let directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    let d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.bias = - 0.001;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
}
function render() {
    let timer = Date.now() * 0.0005;
    scene.children.forEach(child => {
        child.rotation.z = timer;
    })
    // // if you wanted to just go back and forth anteriorly
    // camera.position.x = Math.sin(timer) * 1.5;
    // camera.position.x = Math.sin(timer) * 1.5;
    // camera.position.z = Math.cos(timer) * 1.5;
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
}