#include <stdio.h>
#include <stdlib.h>
#define Bandidos 505

// Preciso de consulta de tempo e devolver o maior
// Preciso de troca de posicao e levar seu tempo de prisao
// Grafos
// Levar em conta ser mandado indireto ou direto
// comando T troca A e B
// comando P procura um inteiro E
// usar dfs iterativa
// fazer o grafo invertido para fazer sentido a busca
// N (1 <= N <= 500), M (0 <= M <= 60.000) e I (1 <= I <= 500)

typedef struct node *link;
struct node { int alvo; link prox; };

struct grafo {
    int qtd_vertices;
    int qtd_arestas;
    link *lista_de_contatos;
};
typedef struct grafo *Grafo;

// Criar novo contato
link Novo_Contato(int alvo, link prox) {
    link t = malloc(sizeof *t);
    t->alvo = alvo;
    t->prox = prox;
    return t;
}

// Inicia grafo
Grafo Iniciar(int qtd_vertices) {
    Grafo G = malloc(sizeof *G);
    G->qtd_vertices = qtd_vertices;
    G->qtd_arestas = 0;
    G->lista_de_contatos = malloc(qtd_vertices * sizeof(link));
    for (int i = 0; i < qtd_vertices; i++)
        G->lista_de_contatos[i] = NULL;
    return G;
}

// Inserir as arestas em ordem reversa
void Inserir_Aresta(Grafo G, int subordinado, int chefe) {
    G->lista_de_contatos[subordinado] = Novo_Contato(chefe, G->lista_de_contatos[subordinado]);
    G->qtd_arestas++;
}

// Funcao para liberar o grafo
void Libera(Grafo G) {
    for (int i = 0; i < G->qtd_vertices; i++) {
        link t = G->lista_de_contatos[i];
        while (t) {
            link proximo = t->prox;
            free(t);
            t = proximo;
        }
    }
    free(G->lista_de_contatos);
    free(G);
}

int tempo[Bandidos];
int procura[Bandidos];
int Localiza[Bandidos];
int marcado[Bandidos];
int busca[Bandidos];

int main(void) {
    int total_bandidos, total_conexoes, total_operacoes;

    while (scanf("%d %d %d", &total_bandidos, &total_conexoes, &total_operacoes) == 3) {
        // funcao para iniciar o grafo
        Grafo investigacao = Iniciar(total_bandidos + 1);

        for (int i = 1; i <= total_bandidos; i++) {
            // Lendo o tempo para o novo vetor
            scanf("%d", &tempo[i]);
            procura[i] = i;
            Localiza[i] = i;
        }

        // Verifica as ligacoes
        for (int i = 0; i < total_conexoes; i++) {
            int chefe, peao;
            scanf("%d %d", &chefe, &peao);
            // função Inserir_Aresta
            Inserir_Aresta(investigacao, peao, chefe);
        }

        for (int i = 0; i < total_operacoes; i++) {
            char missao[4];
            scanf("%s", missao);

            if (missao[0] == 'T') {
                int A, B;
                scanf("%d %d", &A, &B);

                int a = procura[A];
                int b = procura[B];

                procura[A] = b;
                procura[B] = a;

                Localiza[a] = B;
                Localiza[b] = A;

            // Bonus P e Q
            } else if (missao[0] == 'P') {
                int suspeito;
                scanf("%d", &suspeito);

                int alvo = procura[suspeito];

                // Zera o vetor de marcação
                for (int j = 1; j <= total_bandidos; j++) marcado[j] = 0;

                int topo = 0;
                int maior_ficha_criminal = -1;
                int achou_alguem = 0;

                // Usa o vetor busca como pilha
                busca[topo++] = alvo;
                marcado[alvo] = 1;

                // Busca DFS
                while (topo > 0) {
                    int atual = busca[--topo];

                    for (link t = investigacao->lista_de_contatos[atual]; t != NULL; t = t->prox) {
                        int chefe = t->alvo;

                        if (!marcado[chefe]) {
                            marcado[chefe] = 1;
                            achou_alguem = 1;

                            // Acessa o tempo da pessoa localizada naquela posicao
                            int tempo_preso = tempo[Localiza[chefe]];

                            if (tempo_preso > maior_ficha_criminal) {
                                maior_ficha_criminal = tempo_preso;
                            }

                            busca[topo++] = chefe;
                        }
                    }
                }

                if (!achou_alguem) printf("*\n");
                else printf("%d\n", maior_ficha_criminal);

            } else if (missao[0] == 'Q') {
                int suspeito;
                scanf("%d", &suspeito);

                int alvo = procura[suspeito];

                for (int j = 1; j <= total_bandidos; j++) marcado[j] = 0;

                int topo = 0;
                int contagem_de_chefoes = 0;

                busca[topo++] = alvo;
                marcado[alvo] = 1;

                while (topo > 0) {
                    int atual = busca[--topo];

                    for (link t = investigacao->lista_de_contatos[atual]; t != NULL; t = t->prox) {
                        int chefe = t->alvo;

                        if (!marcado[chefe]) {
                            marcado[chefe] = 1;
                            contagem_de_chefoes++;
                            busca[topo++] = chefe;
                        }
                    }
                }

                printf("%d\n", contagem_de_chefoes);
            }
        }

        // libera memoria
        Libera(investigacao);
    }

    return 0;
}
