#include <stdio.h>
#include <stdlib.h>

struct NO{
    int info;
    int alt;
    struct NO *esq;
    struct NO *dir;
};
typedef struct NO *ArvAVL;
ArvAVL *raiz;

int alturaNo(struct NO *no){
    if(no == NULL)return -1;
    return no->alt;
}

int fatorBalanceamento(struct NO *no){
    //fator de balanceamento se mede da diferenca entre esquerda e direita.
    return(alturaNo(no->esq) - alturaNo(no->dir));
}

int maior(int x,int y){
    if(x>y)return x;
    if(y>x)return y;
}

//Balanceamento LL RR RL LR
void Rotacao_LL(ArvAVL *raiz){
    struct NO *no;
    no = (*raiz)->esq;
    (*raiz)->esq = no->dir;
    no->dir = (*raiz);
    (*raiz)->alt = maior(alturaNo((*raiz)->esq),
                         alturaNo((*raiz)->dir)) + 1;
    no->alt = maior(alturaNo(no->esq),
                    alturaNo(no->dir)) + 1;
}

void Rotacao_RR(ArvAVL *raiz){
    struct NO *no;
    no = (*raiz)->dir;
    (*raiz)->dir = no->esq;
    no->esq = (*raiz);
    (*raiz)->alt = maior(alturaNo((*raiz)->esq),
                         alturaNo((*raiz)->dir)) + 1;
    no->alt = maior(alturaNo(no->esq),
                    alturaNo(no->dir)) + 1;
}

void Rotacao_RL(ArvAVL *raiz){
    Rotacao_LL((*raiz)->dir);
    Rotacao_RR(*raiz);
}

void Rotacao_LR(ArvAVL *raiz){
    Rotacao_RR((*raiz)->esq);
    Rotacao_LL(*raiz);
}

int insere(ArvAVL *raiz, int  valor){
    int res;
    if(*raiz == NULL){ // INSERCAO EM ARVORE VAZIA
        ArvAVL novo = malloc(sizeof(struct NO));
        if(novo == NULL)return 0;

        novo->info = valor;
        novo->alt = 0;
        novo->esq = novo->dir = NULL;
        *raiz = novo;
        return 1;
    }


    struct NO *atual = *raiz;
    if(valor < atual->info){
        if((res = insere(&(atual->esq) , valor) == 1){ //alocou em alguma lugar a esquerda
            if(fatorBalanceamento(atual) >= 2){
                if(valor < (*raiz)->esq->info){
                    Rotacao_LL(raiz);
                }else{
                    Rotacao_LR(raiz);
                }
            }
        }else if(valor > atual->info){
            if((res = insere(&(atual->dir)), valor) == 1){
                if(fatorBalanceamento(atual) >= 2){
                    if(valor > (*raiz)->dir->info){
                        Rotacao_RR(raiz);
                    }else{
                        Rotacao_RL(raiz);
                    }
                    }
                }
        }
    atual->alt = maior(alturaNo(atual->esq),alturaNo(atual->dir)) + 1;
    return res;
}
//insercao em AAVL precisa levar em conta o balanceamento






int main(){

}
