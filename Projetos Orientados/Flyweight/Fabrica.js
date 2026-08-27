import { Algarismo } from "./algarismo.js";
export class Fabrica {
    static pool = new Map();
    static criarAlgarismo(valor) {
        if (!this.pool.has(valor)) {
            this.pool.set(valor, new Algarismo(valor));
        }
        return this.pool.get(valor);
    }
    static GetInstance() {
        return this.pool.size;
    }
}
