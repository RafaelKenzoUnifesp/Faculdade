package br.edu.exercicio.strategy;

public class SabadoStrategy implements DiaStrategy {

    @Override
    public String executar(String informacao) {
        return "Realize estudo livre ou descanso: aproveite para explorar \"" + informacao + "\" sem pressão.";
    }

    @Override
    public String getPrioridade() {
        return "BAIXA";
    }
}
