import { Fabrica } from "./fabrica.js";
export class NumeroComposto {
    algarismos = [];
    constructor(tamanho) {
        for (let i = 0; i < tamanho; i++) {
            const digitoAleatorio = Math.floor(Math.random() * 10);
            const instanciaAlgarismo = Fabrica.criarAlgarismo(digitoAleatorio);
            this.algarismos.push(instanciaAlgarismo);
        }
    }
    imprimir() {
        const representacao = this.algarismos.map(a => a.getValor()).join('');
        console.log(`Número gerado: ${representacao}`);
    }
}
