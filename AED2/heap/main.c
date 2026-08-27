#include <stdio.h>
#include <stdlib.h>

//Estudo heap, o algoritmo de heap sort tem a heap  que ve o vetor em uma arvore e considera o pai e seus filhos 2n+1 e 2n+2,
//ideia que nenhum filho seja maior que o pai

//{1,2,3,4,5,6,7,8,9}

void heap(int *vet, int N){
    int i, aux;
    for(i=(N-1)/2;i>=0;i--){
        criaHeap(vet,i,N-1);
    }
    for(i=N-1;i>=1;i--){
        aux = vet[0];
        vet[0] = vet[i];
        vet[i] = aux;
        criaHeap(vet,0,i-1);
    }
}

void criaHeap(int *vet,int i,int f){
    int aux = vet[i];
    int j = i*2 + 1;
    while(j<=f){
        if(j<f){
            if(vet[j]<vet[j+1]){ // compara os dois filhose e pega o maior
                j=j+1;
            }
        }
        if(aux < vet[j]){ // pai menor que filho
            vet[i] = vet[j];
            i=j;
            j = i*2+1;
        }else{
            j = f+1;
        }
    }
    vet[i]=aux;
}

