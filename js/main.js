// ------------- three.js for plotting ply files of structures ------------- //
if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container, camera, cameraTarget, scene, renderer, controls;
var toggles = document.getElementsByClassName('toggle');

var toDraw = [],
    toIgnore = [];

// load toggles
loadToggles();

init(toIgnore);
animate();

function init(toIgnore) {

    // get canvas
    let canvas = document.getElementById('c');
    canvas.innerHTML = '';
    // container
    container = document.createElement('div');
    container.style.height = '400px';
    container.classList.add(new Array('container', 'col-6'))
    // append to canvas
    canvas.appendChild(container);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x72645b);
    scene.fog = new THREE.Fog(0x72645b, 2, 15);
    // camera
    // camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 15);
    // camera.position.set(3, 0.15, 3);
    camera.position.set(0, 0.15, 3);
    cameraTarget = new THREE.Vector3(0, -0.1, 0);
    // Ground
    let plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(40, 40),
        new THREE.MeshPhongMaterial({
            color: 0x999999,
            specular: 0x101010
        })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);
    plane.receiveShadow = true;

    scene.userData.camera = camera;

    // if on server -- requires XMLHttpRequest
    // PLY files
    // let PLYs = [
    //     'data/ply/Parotid_L.ply',
    //     'data/ply/Parotid_R.ply',
    //     'data/ply/PTV54.ply',
    //     'data/ply/PTV60.ply',
    //     'data/ply/PTV70.ply',
    // ]
    // let loader = new THREE.PLYLoader();
    // PLYs.forEach(file => {
    //     loader.load(file, function (geometry) {
    //         if (file.toLowerCase().includes('parotid')) {
    //             color = 'pink';
    //         } else if (file.includes('54')) {
    //             color = 'cyan';
    //         } else if (file.includes('60')) {
    //             color = 'blue';
    //         } else if (file.includes('70')) {
    //             color = 'red';
    //         }
    //         geometry.computeVertexNormals();
    //         let material = new THREE.MeshStandardMaterial({
    //             color: color,
    //             transparent: true,
    //             opacity: 0.6,
    //             flatShading: false
    //         });
    //         let mesh = new THREE.Mesh(geometry, material);
    //         mesh.position.y = 0;
    //         mesh.position.z = 0.1;
    //         mesh.rotation.x = -Math.PI / 2;
    //         mesh.scale.multiplyScalar(0.005);
    //         mesh.castShadow = false;
    //         mesh.receiveShadow = false;
    //         scene.add(mesh);
    //     });
    // });

    // let loader = new ProcessPLYString();
    let color;

    // plyData.forEach(ply => {
    //     loader.load(ply.PLYData, function (geometry) {
    //         if (!toIgnore.includes(ply.StructureId)) {
    //             if (ply.StructureId.toLowerCase().includes('parotid')) {
    //                 color = 'pink';
    //             } else if (ply.StructureId.includes('54')) {
    //                 color = 'cyan';
    //             } else if (ply.StructureId.includes('60')) {
    //                 color = 'blue';
    //             } else if (ply.StructureId.includes('70')) {
    //                 color = 'red';
    //             }
    //             geometry.computeVertexNormals();
    //             let material = new THREE.MeshStandardMaterial({
    //                 color: color,
    //                 transparent: true,
    //                 opacity: 0.6,
    //                 flatShading: false
    //             });
    //             let mesh = new THREE.Mesh(geometry, material);
    //             mesh.position.y = 0;
    //             mesh.position.z = 0.1;
    //             mesh.rotation.x = -Math.PI / 2;
    //             mesh.scale.multiplyScalar(0.005);
    //             mesh.castShadow = false;
    //             mesh.receiveShadow = false;
    //             scene.add(mesh);
    //         };
    //     });

    // });
    let loader = new THREE.PLYLoader();
    plyData.forEach(ply => {
        let geometry = loader.parse(ply.PLYData);

        if (!toIgnore.includes(ply.StructureId)) {
            if (ply.StructureId.toLowerCase().includes('parotid')) {
                color = 'pink';
            } else if (ply.StructureId.includes('54')) {
                color = 'cyan';
            } else if (ply.StructureId.includes('60')) {
                color = 'blue';
            } else if (ply.StructureId.includes('70')) {
                color = 'red';
            }
            geometry.computeVertexNormals();
            let material = new THREE.MeshStandardMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                flatShading: false
            });
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0;
            mesh.position.z = 0.1;
            mesh.rotation.x = -Math.PI / 2;
            mesh.scale.multiplyScalar(0.005);
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            scene.add(mesh);
        };
    });


    // Lights
    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
    addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    // scene.userData.controls = controls;


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
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.bias = -0.001;
}

function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
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

function loadToggles() {
    plyData.sort((a, b) => (a.StructureId > b.StructureId) ? 1 : -1)
    plyData.forEach(data => {

        createToggle('structure-toggle-div', data.StructureId);
    });
}

function createToggle(formDivId, optionLabel) {
    let toggleDiv = document.createElement("div"),
        label = document.createElement("label"),
        labelSpan = document.createElement("span"),
        input = document.createElement("input"),
        formDiv = document.getElementById(formDivId);

    toggleDiv.classList.add('checkbox');

    input.setAttribute('checked', 'true');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('data-toggle', 'toggle');
    input.setAttribute('data-style', 'ios');
    input.setAttribute('data-size', 'small');
    input.setAttribute('data-onstyle', 'success');
    input.setAttribute('data-offstyle', 'danger');
    input.setAttribute('onChange', 'toggleChange(this)');
    // border radius set in main.css

    input.id = optionLabel;

    labelSpan.innerHTML = optionLabel;
    labelSpan.classList.add('ml-2');

    label.appendChild(input);
    label.appendChild(labelSpan);
    toggleDiv.appendChild(label);

    formDiv.appendChild(toggleDiv);
}

function toggleChange(el) {
    if (!$(el).prop('checked')) {
        toIgnore.push(el.id);
        init(toIgnore);
        animate();
    } else {
        let i;
        for (i = 0; i < toIgnore.length; i++) {
            if (toIgnore[i] === el.id) {
                toIgnore.splice(i, 1);
            }
        }
        init(toIgnore);
        animate();
    }
}