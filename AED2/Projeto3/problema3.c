#include <stdio.h>
#include <stdlib.h>
#include <string.h>
//converter a letra para um numero A-1 C-2 G-3 T-4, MULTIPLICAR POR UM NUMERO ALEATORIO PARA NAO TER COLISAO TA DIFERENTE AT.
//Criar funcao de conversao letra para numero
//funcao pra fazer o calculo.
// qual tamanho do vetor? Calculo ex 1*4 + 5*4 + 25*4 ... = 9765624.

int Vet[9765624];

int tranformar(char C){ //transforma cada letra em seu numero respectivo.
    if( C == 'A')return 1;
    if( C == 'C')return 2;
    if( C == 'G')return 3;
    if( C == 'T')return 4;
    return 0;
}

int somar(char *X){
    int soma = 0;
    int tamanho = strlen(X); // importado da biblioteca string para saber o tamanha do char. 
    int multiplicador = 1;
    for(int i= 0;i<tamanho;i++){
        soma += multiplicador * tranformar(X[i]); //1*letra + 2* letra + 2*2 *letra
        multiplicador *= 5; //Utilizei para nao gerar erro com as demais letras, e assim cada dna ter uma posicao diferente no vetor 
    }
    return soma;

}


int main(){
    int N = 0;
    char fita[11];
    char comando[10];

    scanf("%d", &N);

    for(int i  = 0; i < N; i++){
        scanf(" %s %s", comando, fita);
        int dna = somar(fita); // O dna seria a casa do vetor
        if(comando[0] == 'i'){ //insert
            Vet[dna] = 1; // salva numero 1 na posicao dna do vetor 
        }else{
            if(Vet[dna] == 1){ //find
                printf("y\n");
            }else{
                printf("n\n");
            }
        }
    }
}
