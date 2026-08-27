package br.edu.exercicio.strategy;

public class NullDiaStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Nenhuma estratégia definida para o dia informado. Verifique a entrada e tente novamente.";
    }

    @Override
    public String getPrioridade() {
        return "INDEFINIDA";
    }
}
