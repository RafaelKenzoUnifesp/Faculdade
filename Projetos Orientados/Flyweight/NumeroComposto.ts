import { Algarismo } from "./algarismo.js";
import { Fabrica } from "./fabrica.js";    

export class NumeroComposto {
    private algarismos: Algarismo[] = [];

    constructor(tamanho: number) {
        for (let i = 0; i < tamanho; i++) {
            const digitoAleatorio = Math.floor(Math.random() * 10);
            const instanciaAlgarismo = Fabrica.criarAlgarismo(digitoAleatorio);
            this.algarismos.push(instanciaAlgarismo);
        }
    }

    public imprimir(): void {
        const representacao = this.algarismos.map(a => a.getValor()).join('');
        console.log(`Número gerado: ${representacao}`);
    }
}