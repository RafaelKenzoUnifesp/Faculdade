package br.edu.exercicio.strategy;

public class DomingoStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Planeje a próxima semana: defina metas em torno de \"" + informacao + "\" para começar segunda com foco.";
    }

    @Override
    public String getPrioridade() {
        return "BAIXA";
    }
}
