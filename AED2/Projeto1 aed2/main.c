#include <stdio.h>
#include <stdlib.h>

typedef struct{
    int id;   //saber ql candidato que eh
    int votos; //guardar quantos votos recebeu
}Candidato;
typedef Candidato *candidatos;

typedef struct{
    int Votou[3]; //salvar os votos
}Eleitor;
typedef Eleitor *eleitor;


//fazer funcao para ordenar
void Selecao(candidatos vetor, int c){
    Candidato temp;
    for(int i = 1; i < c; i++){
        for(int j = 1; j < c; j++){
            if(vetor[j].votos < vetor[j+1].votos ||
                (vetor[j].votos == vetor[j+1].votos && vetor[j].id > vetor[j+1].id)){
                //troca posicao do j+1 para primeiro ent j+1 > j
                temp = vetor[j];
                vetor[j] = vetor[j+1];
                vetor[j+1] = temp;
            }
        }
    }
}

int main(){
    int V, C;
    scanf("%d %d", &V, &C);
    if (V < 1 || V > 10000) {
            return 0; //valor invalido
    }
    if (C < 1 || C > 100) {
            return 0; //valor invalido
    }
    candidatos novo = malloc(sizeof(Candidato) * (C + 1));
    for(int i = 1; i <= C; i++) { //incializar os candidatos
        novo[i].id = i; // evitar ter um candidato numero 0
        novo[i].votos = 0;
    }
    eleitor v = malloc(sizeof(Eleitor) * V);
    int voto_valido = 0;
    for(int i=0;i<V;i++){
        scanf("%d %d %d", &v[i].Votou[0], &v[i].Votou[1], &v[i].Votou[2]);
        //verificar votos validos
        int primeira_opcao = v[i].Votou[0];
        if(primeira_opcao >= 1 && primeira_opcao <= C) {
            novo[primeira_opcao].votos++;
            voto_valido++;
        }
    }

    if(voto_valido == 0){
        printf("0\n");
        free(novo);
        free(v);
        return 0;
    }

    Selecao(novo,C);
    float teste_ganhador = (novo[1].votos * 100.0)/ voto_valido;
    printf("%d %.2f\n", novo[1].id, teste_ganhador);

    if(teste_ganhador < 50.0 && C>1){
        int id_finalista1 = novo[1].id;
        int id_finalista2 = novo[2].id;
        int voto_valido2 = 0;

        int voto_f1 = 0;
        int voto_f2 = 0;

        for(int i=0;i<V;i++){
            for(int j=0;j<3;j++){
                int escolha = v[i].Votou[j];

                if(escolha == id_finalista1){
                    voto_f1++;
                    voto_valido2++;
                    break;
                }
                if(escolha == id_finalista2){
                    voto_f2++;
                    voto_valido2++;
                    break;
                }

            }
        }
        //verificacao votos t2
        if(voto_valido2 > 0){
            float teste_ganhador2;

            if(voto_f1 > voto_f2 || (voto_f1 == voto_f2 && id_finalista1 < id_finalista2)){ //sugestao da ia para encurtar o codigo, ele verifica caso onde os votos sao iguais mais o id1<id2
                teste_ganhador2 = (voto_f1 *100.0)/ voto_valido2;
                printf("%d %.2f\n", id_finalista1, teste_ganhador2);
            }else{
                teste_ganhador2 = (voto_f2 * 100.0)/ voto_valido2;
                printf("%d %.2f\n", id_finalista2, teste_ganhador2);
            }
        }
    }



    free(novo);
    free(v);
    return 0;
}
