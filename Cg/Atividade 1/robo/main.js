const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    throw new Error("WebGL não é suportado.");
}

const vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 color;

    void main() {
        gl_FragColor = color;
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}

const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, "position");
const colorLocation = gl.getUniformLocation(program, "color");

function drawTriangle(vertices, color) {
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform4f(
        colorLocation,
        color[0],
        color[1],
        color[2],
        color[3]
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        vertices.length / 2
    );
}

function drawRectangle(x1, y1, x2, y2, color) {
    drawTriangle([
        x1, y1,
        x2, y1,
        x1, y2,

        x1, y2,
        x2, y1,
        x2, y2
    ], color);
}

function drawCircle(cx, cy, radius, color) {
    const vertices = [];
    const segments = 40;

    for (let i = 0; i < segments; i++) {
        const angle1 =
            (i / segments) * Math.PI * 2;

        const angle2 =
            ((i + 1) / segments) * Math.PI * 2;

        vertices.push(
            cx, cy,

            cx + Math.cos(angle1) * radius,
            cy + Math.sin(angle1) * radius,

            cx + Math.cos(angle2) * radius,
            cy + Math.sin(angle2) * radius
        );
    }

    drawTriangle(vertices, color);
}

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

drawRectangle(
    -0.7, 0.4, 
     0.7,  0.3, 
    [0.5, 0.5, 0.6, 1.0] 
);
drawRectangle(
    -0.7, 0.3, 
     -0.6,  0.1, 
    [0.5, 0.5, 0.6, 1.0] 
);
drawRectangle(
    0.7, 0.4, 
     0.6 ,  0.6, 
    [0.5, 0.5, 0.6, 1.0] 
);
drawRectangle(
    -0.3, -0.5, 
     0.3, 1, 
    [0.5, 0.5, 0.5, 1.0] 
);

drawRectangle(
    -0.2, -0.3, 
     0.2, 0.4, 
    [0, 2, 2, 1.0] 
);

drawCircle(
    0.01,  // Posição X
    0.6,  // Posição Y 
    0.15,  
    [0.0, 0.0, 0.0, 1.0] 
);

drawCircle(
    0.01,  // Posição X
    0.6,  // Posição Y 
    0.1,  
    [1.0, 1.0, 0.9, 1.0] 
);

