package br.edu.exercicio.strategy;

public class SextaFeiraStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Registre o que foi concluído: documente os resultados de \"" + informacao + "\" antes de encerrar a semana.";
    }

    @Override
    public String getPrioridade() {
        return "MÉDIA";
    }
}
