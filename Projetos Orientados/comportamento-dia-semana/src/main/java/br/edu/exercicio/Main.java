package br.edu.exercicio;

import br.edu.exercicio.selector.StrategySelector;
import br.edu.exercicio.strategy.DiaStrategy;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StrategySelector selector = new StrategySelector();

        System.out.println("=== Comportamento por Dia da Semana ===\n");

        System.out.print("Informe seu nome: ");
        String usuario = scanner.nextLine().trim();

        System.out.println("\nOpções:");
        System.out.println("  1 - Usar o dia atual automaticamente");
        System.out.println("  2 - Informar um dia manualmente");
        System.out.print("Escolha: ");
        String opcao = scanner.nextLine().trim();

        String diaConsultado;
        DiaStrategy strategy;

        if ("2".equals(opcao)) {
            System.out.print("Informe o dia da semana (ex: quarta-feira): ");
            diaConsultado = scanner.nextLine().trim();
            strategy = selector.selecionarPorDia(diaConsultado);
        } else {
            diaConsultado = selector.nomeDiaAtual();
            strategy = selector.selecionarDiaAtual();
        }

        System.out.print("Informe uma tarefa, meta ou informação adicional: ");
        String informacao = scanner.nextLine().trim();

        System.out.println("\n--- Resultado ---");
        DiaContext context = new DiaContext(strategy);
        context.executar(usuario, diaConsultado, informacao);

        scanner.close();
    }
}
