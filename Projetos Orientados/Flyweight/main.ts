import { NumeroComposto } from "./NumeroComposto.js";  
import { Fabrica } from "./fabrica.js";

function main() {
    console.log("--- INICIANDO GERAÇÃO DE NÚMEROS ---\n");

    const QUANTIDADE_NUMEROS = 10;
    const TAMANHO_NUMERO = 10;
    const numerosGerados: NumeroComposto[] = [];

    for (let i = 0; i < QUANTIDADE_NUMEROS; i++) {
        numerosGerados.push(new NumeroComposto(TAMANHO_NUMERO));
    }

    console.log("\n--- IMPRIMINDO RESULTADOS ---\n");

    numerosGerados.forEach(numero => numero.imprimir());

    console.log("\n--- ESTATÍSTICAS DE MEMÓRIA ---");
    const totalExigido = QUANTIDADE_NUMEROS * TAMANHO_NUMERO;
    console.log(`Total de dígitos exigidos pela aplicação: ${totalExigido}`);
    console.log(`Total de instâncias REAIS de 'Algarismo' criadas na memória: ${Fabrica.GetInstance()} (Máximo esperado: 10)`);
}
main();