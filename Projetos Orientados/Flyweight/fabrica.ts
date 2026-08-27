import { Algarismo } from "./algarismo.js";

export class Fabrica { 
    private static pool: Map<number, Algarismo> = new Map();

    public static criarAlgarismo(valor: number): Algarismo {
        if (!this.pool.has(valor)) {
            this.pool.set(valor, new Algarismo(valor));
        }
        return this.pool.get(valor)!;
    }

    public static GetInstance(): number {
        return this.pool.size;
    }

}



