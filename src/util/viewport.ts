export function getCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById('canvas');

  if (!canvas) {
    throw new Error('Cannot initialize canvas');
  }

  return canvas as HTMLCanvasElement;
}

export function getFullscreenSize(): [width: number, height: number] {
  return [document.body.offsetWidth, document.body.offsetHeight];
}

export function getCanvasSize(): [width: number, height: number] {
  const canvas = getCanvas();
  return [canvas.width, canvas.height];
}

export function setCanvasSize(): void {
  const canvas = getCanvas();
  const [width, height] = getFullscreenSize();

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

export function getAspectRatio(): number {
  const [width, height] = getFullscreenSize();
  return width / height;
}
