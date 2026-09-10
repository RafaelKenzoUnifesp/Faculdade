const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// --------------------------------------------------
// VERTICES E CORES
// --------------------------------------------------

function verticesBarra(){
    return new Float32Array([
        -0.05,  0.2,
        -0.05, -0.2,
         0.05,  0.2,
         0.05,  0.2,
        -0.05, -0.2,
         0.05, -0.2
    ]);
}

function verticesBola(){
    let vertices = [];
    let numSegments = 30;
    let radius = 0.05;

    for (let i = 0; i < numSegments; i++) {
        let theta1 = (i / numSegments) * 2 * Math.PI;
        let theta2 = ((i + 1) / numSegments) * 2 * Math.PI;

        vertices.push(0, 0); // Center of the circle
        vertices.push(radius * Math.cos(theta1), radius * Math.sin(theta1));
        vertices.push(radius * Math.cos(theta2), radius * Math.sin(theta2));
    }

    return new Float32Array(vertices);
}

let verticesBarraDireita = verticesBarra();

let corBarraDireita = new Float32Array([
    0.0, 0.0, 1.0,
]);

let verticesBarraEsquerda = verticesBarra();

let corBarraEsquerda = new Float32Array([
    0.0, 1.0, 0.0,
]);

let verticesBolaCentro = verticesBola();

let corBolaCentro = new Float32Array([
    1.0, 0.0, 0.0,
]);

// --------------------------------------------------
// CONSTANTES DE MOVIMENTO E COLISÃO
// --------------------------------------------------

const barraAltura = 0.2;
const barraLargura = 0.05;
const bolaRaio = 0.05;
const limiteYTopo = 1.0;
const limiteYBase = -1.0;

// --------------------------------------------------
// TRANSFORMAÇÕES
// --------------------------------------------------

let xBarraEsquerda = -0.9;
let yBarraEsquerda = 0.0;
let xBarraDireita = 0.9;
let yBarraDireita = 0.0;
let velocidadeBarra = 0.02;

let MbarraEsquerda = m3.translation(xBarraEsquerda, yBarraEsquerda);

let MbarraDireita = m3.translation(xBarraDireita, yBarraDireita);

let MbolaCentro = m3.identity();

// --------------------------------------------------
// BUFFER
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

// --------------------------------------------------
// VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_transform;

out vec3 vColor;

void main() {
    vec3 position = u_transform * vec3(aPosition, 1.0);
    gl_Position = vec4(position.xy, 0.0, 1.0);
}

`;


// --------------------------------------------------
// FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {
    outColor = vec4(uColor, 1.0);
}

`;


// --------------------------------------------------
// COMPILAR SHADERS
// --------------------------------------------------

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


// --------------------------------------------------
// CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// LOCAL DOS ATRIBUTOS E DO UNIFORM
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getUniformLocation(
        program,
        "uColor"
    );

const transformLocation =
    gl.getUniformLocation(
        program,
        "u_transform"
    );

// --------------------------------------------------
// LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// CONTROLE DE TECLADO
// --------------------------------------------------

const teclas = {};

window.addEventListener("keydown", function(e){
    teclas[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", function(e){
    teclas[e.key.toLowerCase()] = false;
});

// --------------------------------------------------
// PLACAR
// --------------------------------------------------

let placarEsquerda = 0;
let placarDireita = 0;

function atualizaPlacar(){
    document.title = "Pong - " + placarEsquerda + " x " + placarDireita;
}

// --------------------------------------------------
// DESENHAR
// --------------------------------------------------

const numComponents = 2;

function drawScene(){
    
    atualizaAnimacao();

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    drawBarraEsquerda();
    drawBarraDireita();
    drawBolaCentro();
    
    requestAnimationFrame(drawScene);
}

function drawBarraEsquerda(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraEsquerda,
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

    gl.uniform3fv(
        colorLocation,
        corBarraEsquerda
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraEsquerda
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraEsquerda.length / numComponents
    );

}

function drawBarraDireita(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraDireita,
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

    gl.uniform3fv(
        colorLocation,
        corBarraDireita
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraDireita
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraDireita.length / numComponents
    );

}

function drawBolaCentro(){

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBolaCentro,
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

    gl.uniform3fv(
        colorLocation,
        corBolaCentro
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbolaCentro
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBolaCentro.length / numComponents
    );

}

// --------------------------------------------------
// PARÂMETROS ANIMAÇÃO
// --------------------------------------------------

let txBola = 0.0;
let tyBola = 0.0;
let txBola_offset = 0.012;
let tyBola_offset = 0.008;

function resetBola(direcao){
    txBola = 0.0;
    tyBola = 0.0;
    txBola_offset = 0.012 * direcao;
    tyBola_offset = (Math.random() * 0.012) - 0.006;
    if(Math.abs(tyBola_offset) < 0.003){
        tyBola_offset = 0.006;
    }
}

function moveBarras(){
    if(teclas["w"]){
        yBarraEsquerda += velocidadeBarra;
    }
    if(teclas["s"]){
        yBarraEsquerda -= velocidadeBarra;
    }
    if(teclas["arrowup"]){
        yBarraDireita += velocidadeBarra;
    }
    if(teclas["arrowdown"]){
        yBarraDireita -= velocidadeBarra;
    }

    const limiteBarra = limiteYTopo - barraAltura;

    if(yBarraEsquerda > limiteBarra) yBarraEsquerda = limiteBarra;
    if(yBarraEsquerda < -limiteBarra) yBarraEsquerda = -limiteBarra;
    if(yBarraDireita > limiteBarra) yBarraDireita = limiteBarra;
    if(yBarraDireita < -limiteBarra) yBarraDireita = -limiteBarra;

    MbarraEsquerda = m3.translation(xBarraEsquerda, yBarraEsquerda);
    MbarraDireita = m3.translation(xBarraDireita, yBarraDireita);
}

function checaColisaoBarra(xBarra, yBarra){
    const dentroX = txBola + bolaRaio >= xBarra - barraLargura &&
                    txBola - bolaRaio <= xBarra + barraLargura;
    const dentroY = tyBola + bolaRaio >= yBarra - barraAltura &&
                    tyBola - bolaRaio <= yBarra + barraAltura;
    return dentroX && dentroY;
}

function atualizaAnimacao(){
    moveBarras();

    txBola += txBola_offset;
    tyBola += tyBola_offset;

    if(tyBola + bolaRaio > limiteYTopo || tyBola - bolaRaio < limiteYBase){
        tyBola_offset = -tyBola_offset;
    }

    if(txBola_offset < 0 && checaColisaoBarra(xBarraEsquerda, yBarraEsquerda)){
        txBola_offset = -txBola_offset;
        txBola = xBarraEsquerda + barraLargura + bolaRaio;
    }

    if(txBola_offset > 0 && checaColisaoBarra(xBarraDireita, yBarraDireita)){
        txBola_offset = -txBola_offset;
        txBola = xBarraDireita - barraLargura - bolaRaio;
    }

    if(txBola - bolaRaio < -1.0){
        placarDireita += 1;
        atualizaPlacar();
        resetBola(1);
    }

    if(txBola + bolaRaio > 1.0){
        placarEsquerda += 1;
        atualizaPlacar();
        resetBola(-1);
    }

    MbolaCentro = m3.translation(txBola, tyBola);
}


// --------------------------------------------------
// INÍCIO DO DESENHO
// --------------------------------------------------

atualizaPlacar();
drawScene();