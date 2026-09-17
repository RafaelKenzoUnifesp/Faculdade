const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_viewTransform;
uniform mat3 u_modelTransform;

void main() {
    vec3 position =
        u_viewTransform *
        u_modelTransform *
        vec3(aPosition, 1.0);

    gl_Position =
        vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {
    outColor =
        vec4(uColor, 1.0);
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error);
    }
    return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
}

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

class Renderer {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation = gl.getAttribLocation(program, "aPosition");
        this.colorLocation = gl.getUniformLocation(program, "uColor");
        this.viewTransformLocation = gl.getUniformLocation(program, "u_viewTransform");
        this.modelTransformLocation = gl.getUniformLocation(program, "u_modelTransform");

        this.viewTransform = m3.identity();
        this.verticesBuffer = gl.createBuffer();
    }

    defineViewTransform(viewTransform) {
        this.viewTransform = viewTransform;
    }

    draw(object) {
        const gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, object.vertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform3fv(this.colorLocation, object.color);
        gl.uniformMatrix3fv(this.modelTransformLocation, false, object.modelTransform);
        gl.uniformMatrix3fv(this.viewTransformLocation, false, this.viewTransform);

        gl.drawArrays(gl.TRIANGLES, 0, object.vertices.length / 2);
    }
}

function rectangleVertices(x, y, width, height) {
    return [
        x, y,
        x + width, y + height,
        x, y + height,

        x, y,
        x + width, y,
        x + width, y + height
    ];
}

function circleVertices(radius, numSegments) {
    const vertices = [];
    for (let i = 0; i < numSegments; i++) {
        const theta1 = (i / numSegments) * 2 * Math.PI;
        const theta2 = ((i + 1) / numSegments) * 2 * Math.PI;

        vertices.push(0, 0);
        vertices.push(radius * Math.cos(theta1), radius * Math.sin(theta1));
        vertices.push(radius * Math.cos(theta2), radius * Math.sin(theta2));
    }
    return vertices;
}

class SceneObject {
    constructor(vertices, color) {
        this.vertices = vertices;
        this.color = color;
        this.modelTransform = m3.identity();
    }

    updateModelTransform(modelTransform) {
        this.modelTransform = modelTransform;
    }
}

class Torso extends SceneObject {
    constructor() {
        super(
            new Float32Array(rectangleVertices(-0.15, -0.22, 0.30, 0.44)),
            new Float32Array([0.15, 0.45, 0.65])
        );
    }
}

class ChestPlate extends SceneObject {
    constructor() {
        super(
            new Float32Array(rectangleVertices(-0.1, -0.12, 0.2, 0.24)),
            new Float32Array([0.85, 0.9, 0.95])
        );
    }
}

class Head extends SceneObject {
    constructor() {
        super(
            new Float32Array(circleVertices(0.12, 35)),
            new Float32Array([0.9, 0.92, 0.95])
        );
        this.theta = 0.0;
    }
    updateRotation(angle) { this.theta = angle; }
    updateModelTransform(parentTransform) {
        const local = m3.multiply(m3.translation(0.0, 0.36), m3.rotation(this.theta));
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class Visor extends SceneObject {
    constructor() {
        super(
            new Float32Array(rectangleVertices(-0.07, -0.02, 0.14, 0.06)),
            new Float32Array([0.1, 0.8, 0.9])
        );
    }
    updateModelTransform(parentTransform) {
        const local = m3.translation(0.0, 0.35);
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class Antenna extends SceneObject {
    constructor() {
        super(
            new Float32Array(rectangleVertices(-0.015, 0.0, 0.03, 0.12)),
            new Float32Array([0.3, 0.3, 0.3])
        );
    }
    updateModelTransform(parentTransform) {
        const local = m3.translation(0.0, 0.48);
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class AntennaTip extends SceneObject {
    constructor() {
        super(
            new Float32Array(circleVertices(0.03, 20)),
            new Float32Array([0.9, 0.2, 0.2])
        );
    }
    updateModelTransform(parentTransform) {
        const local = m3.translation(0.0, 0.63);
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class Limb extends SceneObject {
    constructor(color, width = 0.07, height = 0.2) {
        super(
            new Float32Array(rectangleVertices(-width / 2, -height, width, height)),
            color
        );
        this.theta = 0.0;
        this.height = height; 
    }
    updateRotation(angle) { this.theta = angle; }
    updateModelTransform(parentTransform, offsetX, offsetY) {
        const local = m3.multiply(m3.translation(offsetX, offsetY), m3.rotation(this.theta));
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class Foot extends SceneObject {
    constructor() {
        super(
            new Float32Array(rectangleVertices(-0.05, -0.04, 0.1, 0.05)),
            new Float32Array([0.1, 0.1, 0.15])
        );
    }
    updateModelTransform(parentTransform, limbOffsetX, limbOffsetY, limbHeight, limbTheta) {
        const local = m3.multiply(
            m3.translation(limbOffsetX, limbOffsetY),
            m3.multiply(m3.rotation(limbTheta), m3.translation(0.0, -limbHeight))
        );
        this.modelTransform = m3.multiply(parentTransform, local);
    }
}

class Robot {
    constructor(tx, ty, speed) {
        this.tx = tx;
        this.ty = ty;
        this.speed = speed;
        this.time = 0;

        this.torso = new Torso();
        this.chest = new ChestPlate();
        this.head = new Head();
        this.visor = new Visor();
        this.antenna = new Antenna();
        this.antennaTip = new AntennaTip();

        // CORES BEM VISÍVEIS (Cinza Escuro)
        const armColor = new Float32Array([0.25, 0.25, 0.3]);
        const legColor = new Float32Array([0.15, 0.15, 0.2]);

        this.leftArm = new Limb(armColor, 0.06, 0.22);
        this.rightArm = new Limb(armColor, 0.06, 0.22);
        
        // Pernas com altura 0.18 ajustadas
        this.leftLeg = new Limb(legColor, 0.07, 0.18);
        this.rightLeg = new Limb(legColor, 0.07, 0.18);

        this.leftFoot = new Foot();
        this.rightFoot = new Foot();
    }

    move() {
        this.tx += this.speed;
        if (this.tx > 0.7 || this.tx < -0.7) {
            this.speed = -this.speed;
        }

        this.time += 0.09;

        let walkBobbing = Math.abs(Math.sin(this.time * 2)) * 0.02;
        let currentY = this.ty + walkBobbing;

        let armSwing = Math.sin(this.time) * 0.45;
        let legSwing = Math.sin(this.time) * 0.55;

        this.leftArm.updateRotation(armSwing);
        this.rightArm.updateRotation(-armSwing);
        
        this.leftLeg.updateRotation(-legSwing);
        this.rightLeg.updateRotation(legSwing);

        this.head.updateRotation(Math.sin(this.time * 0.5) * 0.1);

        const robotTransform = m3.translation(this.tx, currentY);

        this.torso.updateModelTransform(robotTransform);
        this.chest.updateModelTransform(robotTransform);
        this.head.updateModelTransform(robotTransform);
        this.visor.updateModelTransform(robotTransform);
        this.antenna.updateModelTransform(robotTransform);
        this.antennaTip.updateModelTransform(robotTransform);

        this.leftArm.updateModelTransform(robotTransform, -0.18, 0.15);
        this.rightArm.updateModelTransform(robotTransform, 0.18, 0.15);
        
        // Posição de encaixe exata na base do tronco (-0.22 no Y)
        this.leftLeg.updateModelTransform(robotTransform, -0.08, -0.22);
        this.rightLeg.updateModelTransform(robotTransform, 0.08, -0.22);

        this.leftFoot.updateModelTransform(robotTransform, -0.08, -0.22, 0.18, -legSwing);
        this.rightFoot.updateModelTransform(robotTransform, 0.08, -0.22, 0.18, legSwing);
    }

    draw(renderer) {
        // DESENHAR PERNAS E PÉS PRIMEIRO (Para ficarem atrás/alinhados ao tronco)
        renderer.draw(this.leftLeg);
        renderer.draw(this.rightLeg);
        renderer.draw(this.leftFoot);
        renderer.draw(this.rightFoot);

        // DESENHAR CORPO E DETALHES
        renderer.draw(this.torso);
        renderer.draw(this.chest);
        renderer.draw(this.antenna);
        renderer.draw(this.antennaTip);
        renderer.draw(this.leftArm);
        renderer.draw(this.rightArm);
        renderer.draw(this.head);
        renderer.draw(this.visor);
    }
}

class Scene {
    constructor(gl, program) {
        this.renderer = new Renderer(gl, program);

        const aspect = canvas.width / canvas.height;
        this.viewTransform = m3.setClippingWindow(-aspect, -1.0, aspect, 1.0);
        this.renderer.defineViewTransform(this.viewTransform);

        this.robot = new Robot(0.0, 0.1, 0.004);
    }

    update() {
        this.robot.move();
    }

    draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        this.robot.draw(this.renderer);
    }

    execute() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.execute());
    }

    init() {
        requestAnimationFrame(() => this.execute());
    }
}

gl.clearColor(0.97, 0.92, 0.95, 1.0);
gl.viewport(0, 0, canvas.width, canvas.height);

const scene = new Scene(gl, program);
scene.init();