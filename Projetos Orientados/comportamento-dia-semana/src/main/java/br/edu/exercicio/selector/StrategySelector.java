package br.edu.exercicio.selector;

import br.edu.exercicio.strategy.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class StrategySelector {

    private final Map<String, DiaStrategy> estrategias;
    private final DiaStrategy nullStrategy;

    public StrategySelector() {
        nullStrategy = new NullDiaStrategy();
        estrategias = new HashMap<>();
        estrategias.put("segunda-feira", new SegundaFeiraStrategy());
        estrategias.put("terca-feira", new TercaFeiraStrategy());
        estrategias.put("quarta-feira", new QuartaFeiraStrategy());
        estrategias.put("quinta-feira", new QuintaFeiraStrategy());
        estrategias.put("sexta-feira", new SextaFeiraStrategy());
        estrategias.put("sabado", new SabadoStrategy());
        estrategias.put("domingo", new DomingoStrategy());
    }

    public DiaStrategy selecionarPorDia(String dia) {
        if (dia == null || dia.isBlank()) {
            return nullStrategy;
        }
        return estrategias.getOrDefault(normalizar(dia), nullStrategy);
    }

    public DiaStrategy selecionarDiaAtual() {
        DayOfWeek diaDaSemana = LocalDate.now().getDayOfWeek();
        String chave = converterDayOfWeek(diaDaSemana);
        return estrategias.getOrDefault(chave, nullStrategy);
    }

    public String nomeDiaAtual() {
        DayOfWeek diaDaSemana = LocalDate.now().getDayOfWeek();
        return converterDayOfWeek(diaDaSemana);
    }

    private String normalizar(String dia) {
        return dia.trim()
                  .toLowerCase()
                  .replace("ç", "c")
                  .replace("ã", "a")
                  .replace("á", "a")
                  .replace("â", "a")
                  .replace("à", "a")
                  .replace("é", "e")
                  .replace("ê", "e")
                  .replace("í", "i")
                  .replace("ó", "o")
                  .replace("ô", "o")
                  .replace("ú", "u")
                  .replace("ü", "u");
    }

    private String converterDayOfWeek(DayOfWeek day) {
        return switch (day) {
            case MONDAY    -> "segunda-feira";
            case TUESDAY   -> "terca-feira";
            case WEDNESDAY -> "quarta-feira";
            case THURSDAY  -> "quinta-feira";
            case FRIDAY    -> "sexta-feira";
            case SATURDAY  -> "sabado";
            case SUNDAY    -> "domingo";
        };
    }
}
