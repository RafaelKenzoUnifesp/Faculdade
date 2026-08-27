# Comportamento por Dia da Semana — Padrão Strategy

## Instruções de execução

**Pré-requisitos:** Java 17+ instalado.

```bash
# Compilar
find src -name "*.java" | xargs javac -d out

# Executar
java -cp out br.edu.exercicio.Main
```

Ou importe o projeto em qualquer IDE (IntelliJ, Eclipse, VS Code) e execute a classe `Main`.

---

## Estrutura das estratégias

```
br.edu.exercicio
├── Main.java                         ← Ponto de entrada; lê entrada do usuário e aciona o contexto
├── DiaContext.java                   ← Contexto: mantém referência à estratégia e delega a execução
├── strategy/
│   ├── DiaStrategy.java              ← Interface estratégia (contrato: executar + getPrioridade)
│   ├── SegundaFeiraStrategy.java     ← Estratégia concreta — Segunda-feira (prioridade ALTA)
│   ├── TercaFeiraStrategy.java       ← Estratégia concreta — Terça-feira  (prioridade ALTA)
│   ├── QuartaFeiraStrategy.java      ← Estratégia concreta — Quarta-feira (prioridade MÉDIA)
│   ├── QuintaFeiraStrategy.java      ← Estratégia concreta — Quinta-feira (prioridade MÉDIA)
│   ├── SextaFeiraStrategy.java       ← Estratégia concreta — Sexta-feira  (prioridade MÉDIA)
│   ├── SabadoStrategy.java           ← Estratégia concreta — Sábado       (prioridade BAIXA)
│   ├── DomingoStrategy.java          ← Estratégia concreta — Domingo      (prioridade BAIXA)
│   └── NullDiaStrategy.java          ← Null Object: estratégia segura para ausência de comportamento
└── selector/
    └── StrategySelector.java         ← Seleciona a estratégia adequada por nome de dia ou data atual
```

O `StrategySelector` popula um `Map<String, DiaStrategy>` no construtor e usa `getOrDefault(chave, nullStrategy)` para nunca retornar `null`. O `DiaContext` recebe a estratégia já resolvida e apenas a executa, sem conhecer qual implementação concreta está em uso.

---

## Questões de reflexão

### 1. Como evitar verificações repetidas de valores nulos no código principal?

Adotando o padrão **Null Object**: em vez de retornar `null` quando nenhuma estratégia for encontrada, o `StrategySelector` retorna um objeto `NullDiaStrategy` que implementa a mesma interface `DiaStrategy`. Dessa forma, o código cliente (`DiaContext`, `Main`) jamais precisa verificar `if (strategy == null)` antes de chamar `executar()` ou `getPrioridade()`, pois sempre há um objeto válido respondendo ao contrato.

### 2. Qual padrão de projeto pode ser utilizado para representar a ausência de uma estratégia de forma segura?

O padrão **Null Object** (também chamado de *Special Case*). Ele consiste em criar uma classe concreta que implementa a mesma interface das demais estratégias, mas cujo comportamento é neutro ou informativo — no caso desta solução, exibe uma mensagem de ausência sem lançar exceções nem interromper o fluxo do programa.

### 3. Explique brevemente como esse padrão seria incorporado à solução.

A classe `NullDiaStrategy` implementa `DiaStrategy` retornando uma mensagem padrão em `executar()` e `"INDEFINIDA"` em `getPrioridade()`. O `StrategySelector` a instancia uma única vez e a usa como valor padrão em `Map.getOrDefault()`. Assim, qualquer dia inválido, inexistente ou sem estratégia mapeada receberá automaticamente o `NullDiaStrategy`, sem que nenhuma camada superior precise tratar `null`.

---

## Exemplos de execução

### Entrada válida

```
=== Comportamento por Dia da Semana ===

Informe seu nome: Ana
Opções:
  1 - Usar o dia atual automaticamente
  2 - Informar um dia manualmente
Escolha: 2
Informe o dia da semana (ex: quarta-feira): quarta-feira
Informe uma tarefa, meta ou informação adicional: Implementar relatório

--- Resultado ---
Usuário: Ana
Dia consultado: quarta-feira
Prioridade: MÉDIA
Mensagem: Dia de revisão: verifique o andamento da atividade "Implementar relatório".
```

### Entrada inválida

```
=== Comportamento por Dia da Semana ===

Informe seu nome: Carlos
Opções:
  1 - Usar o dia atual automaticamente
  2 - Informar um dia manualmente
Escolha: 2
Informe o dia da semana (ex: quarta-feira): feriado
Informe uma tarefa, meta ou informação adicional: Descansar

--- Resultado ---
Usuário: Carlos
Dia consultado: feriado
Prioridade: INDEFINIDA
Mensagem: Nenhuma estratégia definida para o dia informado. Verifique a entrada e tente novamente.
```
