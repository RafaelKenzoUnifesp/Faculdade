package br.edu.exercicio.strategy;

public class QuintaFeiraStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Colabore com alguém da equipe: compartilhe seu progresso em \"" + informacao + "\" e peça ou ofereça ajuda.";
    }

    @Override
    public String getPrioridade() {
        return "MÉDIA";
    }
}
