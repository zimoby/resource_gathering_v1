const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float chunkSize;
  uniform vec2 offset;
  uniform float subGrids;
  uniform float lineWidth;
  uniform vec3 gridColor;
  uniform vec3 subGridColor;
  
  varying vec2 vUv;

  void main() {
    vec2 coord = (vUv + offset / chunkSize) * chunkSize;
    
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    
    vec2 subGrid = abs(fract(coord * subGrids - 0.5) - 0.5) / fwidth(coord * subGrids);
    float subLine = min(subGrid.x, subGrid.y);
    
    float alpha = 1.0 - min(line, 1.0);
    float subAlpha = 1.0 - min(subLine, 1.0);
    
    vec3 color = mix(subGridColor, gridColor, step(lineWidth * 1.0, line));
    color = mix(color, vec3(0.0), step(lineWidth, subLine));
    
    gl_FragColor = vec4(color, max(alpha, subAlpha));
  }
`;

export { vertexShader, fragmentShader };