import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import './style.css';

function getCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById('canvas');

  if (!canvas) {
    throw new Error('Cannot initialize canvas');
  }

  return canvas as HTMLCanvasElement;
}

function getFullscreenSize(): [width: number, height: number] {
  return [document.body.offsetWidth, document.body.offsetHeight];
}

function setCanvasSize(): void {
  const canvas = getCanvas();
  const [width, height] = getFullscreenSize();

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function getAspectRatio(): number {
  const [width, height] = getFullscreenSize();
  return width / height;
}

function main(): void {
  const scene = new Scene();

  // Create a red cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new Mesh(geometry, material);

  scene.add(mesh);

  // Update initial size of canvas
  setCanvasSize();

  // Add a camera of 75 degrees FOV
  const camera = new PerspectiveCamera(75, getAspectRatio());
  camera.position.z = 5;

  // Create a renderer
  const renderer = new WebGLRenderer({ canvas: getCanvas() });
  renderer.setSize(...getFullscreenSize());

  // Update canvas and camera parameters on resize
  window.addEventListener('resize', () => {
    setCanvasSize();

    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();

    renderer.setSize(...getFullscreenSize());
    renderer.render(scene, camera);
  });

  function animate(): void {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}

main();
