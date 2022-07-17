import { 
  AxesHelper, 
  BoxGeometry, 
  Clock, 
  Group, 
  LoadingManager, 
  Mesh, 
  MeshBasicMaterial, 
  NearestFilter, 
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';
import { debounce } from './util/debounce';
import { getCanvas, getFullscreenSize, getAspectRatio, setCanvasSize } from './util/viewport';
import './style.css';

function main(): void {
  const loadingManager = new LoadingManager();

  const textureLoader = new TextureLoader(loadingManager);
  const colorTexture = textureLoader.load('/textures/minecraft.png');
  colorTexture.generateMipmaps = false;
  colorTexture.magFilter = NearestFilter;

  const gui = new lil.GUI();

  const scene = new Scene();

  // Create a red cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ map: colorTexture });
  const mesh = new Mesh(geometry, material);

  // Positioning via .set method of Vector3
  // mesh.position.set(0.7, -0.6, 1);
  mesh.position.set(0, 0, 0);

  // Scale is also Vector3, and each axis can be configured separately
  // mesh.scale.x = 0.5;
  // mesh.scale.z = 0.5;
  // mesh.scale.set(0.5, 0.5, 0.5);

  // Rotation is an instance of THREE.Euler. x, y and z represent angles of x, y and z axes in radians.
  // Default is 0. 
  // Rotations are applied x->y->z. By calling obj.rotation.reorder('yxz') this order can be changed.
  // Quaternions can be used to resolve issues related to the order of rotations.
  // mesh.rotation.x = Math.PI * 0.25;
  // mesh.rotation.y = Math.PI * 0.25;

  scene.add(mesh);

  gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.1)
    .name('cube y');

  gui
    .add(mesh, 'visible');

  gui
    .add(material, 'wireframe');

  // Update initial size of canvas
  setCanvasSize();

  // Add a camera of 75 degrees FOV
  const camera = new PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
  camera.position.set(0, 0, 3);

  // .lookAt can be used to direct a camera to a position.
  camera.lookAt(mesh.position);

  // Add an axes helper
  const axesHelper = new AxesHelper();
  scene.add(axesHelper);

  // Objects can be grouped inside the THREE.Group instance
  const group = new Group();

  const cube1 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
  const cube2 = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), new MeshBasicMaterial({ color: 0xf0f0f0 }));
  const cube3 = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x0000ff }));

  cube1.position.x -= 1;
  cube2.position.x -= 2;
  cube3.position.x -= 2.75;

  // group.add(cube1, cube2, cube3);
  // scene.add(group);

  // Create a renderer
  const canvas = getCanvas();
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(...getFullscreenSize());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const resizeHandler = debounce(() => {
    setCanvasSize();
 
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(...getFullscreenSize());
  }, 250);

  // Update canvas and camera parameters on resize
  window.addEventListener('resize', resizeHandler);

  // Controls
  const controls = new OrbitControls(camera, getCanvas());
  controls.target = scene.position;
  controls.enableDamping = true;

  // Fullscreen
  window.addEventListener('dblclick', async () => {
    if (!document.fullscreenElement) {
      await document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  const clock = new Clock();

  function animate(): void {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    controls.update();

    // Geometric transformations are applied to the whole group
    group.rotation.y = elapsedTime * Math.PI;

    renderer.render(scene, camera);
  }

  animate();
}

main();
