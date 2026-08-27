package br.edu.exercicio.strategy;

public class QuartaFeiraStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Dia de revisão: verifique o andamento da atividade \"" + informacao + "\".";
    }

    @Override
    public String getPrioridade() {
        return "MÉDIA";
    }
}
