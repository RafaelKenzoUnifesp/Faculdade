package br.edu.exercicio.strategy;

public class SegundaFeiraStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Organize suas prioridades: comece a semana definindo o que é mais importante para \"" + informacao + "\".";
    }

    @Override
    public String getPrioridade() {
        return "ALTA";
    }
}
