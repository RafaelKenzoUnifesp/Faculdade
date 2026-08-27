package br.edu.exercicio;

import br.edu.exercicio.strategy.DiaStrategy;

public class DiaContext {

    private DiaStrategy strategy;

    public DiaContext(DiaStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(DiaStrategy strategy) {
        this.strategy = strategy;
    }

    public void executar(String usuario, String dia, String informacao) {
        System.out.println("Usuário: " + usuario);
        System.out.println("Dia consultado: " + dia);
        System.out.println("Prioridade: " + strategy.getPrioridade());
        System.out.println("Mensagem: " + strategy.executar(informacao));
    }
}
