package br.edu.exercicio.strategy;

public class TercaFeiraStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Avance nas tarefas pendentes: dedique energia para concluir \"" + informacao + "\" hoje.";
    }

    @Override
    public String getPrioridade() {
        return "ALTA";
    }
}
