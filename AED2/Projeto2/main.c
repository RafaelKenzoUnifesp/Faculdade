#include <stdio.h>
#include <stdlib.h>

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define MAX_HASH 200003

typedef struct No {
    int valor;
    struct No *prox;
} No;

No *hash[MAX_HASH];

int hashFunc(int x) {
    if (x < 0)
        x = -x;

    return x % MAX_HASH;
}

void inserir(int x) {
    int h = hashFunc(x);

    No *novo = (No*) malloc(sizeof(No));
    novo->valor = x;
    novo->prox = hash[h];

    hash[h] = novo;
}

int buscar(int x) {
    int h = hashFunc(x);

    No *atual = hash[h];

    while (atual != NULL) {
        if (atual->valor == x)
            return 1;

        atual = atual->prox;
    }

    return 0;
}


int ehPrimo(int x) {
    if (x < 2)return 0;
    if (x == 2)return 1;
    if (x % 2 == 0)return 0;

    int limite = sqrt(x);
    for (int i = 3; i <= limite; i += 2) {
        if (x % i == 0)
            return 0;
    }

    return 1;
}

int main() {
    int S_size, N;

    scanf("%d %d", &S_size, &N);

    int *v = (int*) malloc(S_size * sizeof(int));

    for (int i = 0; i < S_size; i++) {
        scanf("%d", &v[i]);
        inserir(v[i]);
    }

    int pares = 0;

    for (int i = 0; i < S_size; i++) {
        int x = v[i];
        int y = N - x;

        if (x < y && buscar(y)) {

            int diferenca = abs(x - y);

            if (ehPrimo(diferenca)) {
                pares++;
            }
        }
    }

    printf("%d\n", pares);

    return 0;
}
