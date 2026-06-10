const EDGE_TABLE = [
  [],
  [[3, 0]],
  [[1, 0]],
  [[1, 3]],
  [[2, 1]],
  [[0, 3], [2, 1]],
  [[2, 0]],
  [[2, 3]],
  [[3, 2]],
  [[0, 2]],
  [[1, 0], [3, 2]],
  [[1, 2]],
  [[0, 3], [1, 2]],
  [[3, 0]],
  [[2, 1], [3, 0]],
  [[2, 0], [3, 2]],
  [],
];

function edgePoint(edge, x, y, values, width, threshold) {
  const valueAt = (cx, cy) => values[cy * width + cx];

  if (edge === 0) {
    const v0 = valueAt(x, y);
    const v1 = valueAt(x + 1, y);
    const t = (threshold - v0) / (v1 - v0 || 1);
    return [x + t, y];
  }
  if (edge === 1) {
    const v0 = valueAt(x + 1, y);
    const v1 = valueAt(x + 1, y + 1);
    const t = (threshold - v0) / (v1 - v0 || 1);
    return [x + 1, y + t];
  }
  if (edge === 2) {
    const v0 = valueAt(x, y + 1);
    const v1 = valueAt(x + 1, y + 1);
    const t = (threshold - v0) / (v1 - v0 || 1);
    return [x + t, y + 1];
  }
  const v0 = valueAt(x, y);
  const v1 = valueAt(x, y + 1);
  const t = (threshold - v0) / (v1 - v0 || 1);
  return [x, y + t];
}

function blurValues(values, width, height, passes = 3) {
  let src = values.slice();
  let dst = new Float32Array(src.length);

  for (let p = 0; p < passes; p += 1) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let sum = 0;
        let count = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            sum += src[ny * width + nx];
            count += 1;
          }
        }
        dst[y * width + x] = sum / count;
      }
    }
    [src, dst] = [dst, src];
  }

  return src;
}

function sampleImageValues(image, size) {
  const scratch = document.createElement('canvas');
  scratch.width = size;
  scratch.height = size;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  const scale = Math.max(size / image.width, size / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);

  const { data } = ctx.getImageData(0, 0, size, size);
  const values = new Float32Array(size * size);
  for (let i = 0; i < values.length; i += 1) {
    const px = i * 4;
    values[i] = (data[px] * 0.299 + data[px + 1] * 0.587 + data[px + 2] * 0.114) / 255;
  }

  return blurValues(values, size, size, 3);
}

function buildThresholds(values, levels) {
  let min = 1;
  let max = 0;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }

  const span = max - min || 1;
  const innerMin = min + span * 0.14;
  const innerMax = max - span * 0.08;

  return Array.from({ length: levels }, (_, i) => (
    innerMin + ((innerMax - innerMin) * (i + 1)) / (levels + 1)
  ));
}

function buildContourPaths(values, width, height, thresholds) {
  const paths = [];

  for (const threshold of thresholds) {
    const segments = [];

    for (let y = 0; y < height - 1; y += 1) {
      for (let x = 0; x < width - 1; x += 1) {
        let caseIndex = 0;
        if (values[y * width + x] >= threshold) caseIndex |= 1;
        if (values[y * width + x + 1] >= threshold) caseIndex |= 2;
        if (values[(y + 1) * width + x + 1] >= threshold) caseIndex |= 4;
        if (values[(y + 1) * width + x] >= threshold) caseIndex |= 8;

        for (const [a, b] of EDGE_TABLE[caseIndex]) {
          segments.push([
            edgePoint(a, x, y, values, width, threshold),
            edgePoint(b, x, y, values, width, threshold),
          ]);
        }
      }
    }

    paths.push(segments);
  }

  return paths;
}

export function renderTopoPortrait(canvas, image, options = {}) {
  const {
    gridSize = 88,
    levels = 9,
    lineColor = '#1C1B1B',
    background = '#FDFDFC',
    displaySize: forcedSize,
  } = options;

  const container = canvas.parentElement;
  const displaySize = forcedSize
    || container?.clientWidth
    || canvas.clientWidth
    || 240;

  if (displaySize < 2 || !image?.width) return false;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(displaySize * dpr);
  canvas.height = Math.round(displaySize * dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, displaySize, displaySize);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, displaySize, displaySize);

  const values = sampleImageValues(image, gridSize);
  const thresholds = buildThresholds(values, levels);
  const paths = buildContourPaths(values, gridSize, gridSize, thresholds);
  const scale = displaySize / (gridSize - 1);
  const lineWidth = Math.max(0.45, displaySize / 420);

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const segments of paths) {
    for (const [[x0, y0], [x1, y1]] of segments) {
      ctx.beginPath();
      ctx.moveTo(x0 * scale, y0 * scale);
      ctx.lineTo(x1 * scale, y1 * scale);
      ctx.stroke();
    }
  }

  return true;
}
