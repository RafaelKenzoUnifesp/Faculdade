import sys

MOVER = "MOVER"
VIRAR_E = "VIRAR (E)"
VIRAR_D = "VIRAR (D)"
ATIRAR = "ATIRAR"
AGARRAR = "AGARRAR"
ESCALAR = "ESCALAR"
ACOES_VALIDAS = {MOVER, VIRAR_E, VIRAR_D, ATIRAR, AGARRAR, ESCALAR}

# =====================================================================
# ÁREA DO AGENTE IMPLEMENTADO
# =====================================================================

class Agente:
    def __init__(self):
        self.nome = "Agente_Template"
        self.estado = "EXPLORANDO"
        
        self.x = 1
        self.y = 1
        self.direcao = 0
        self.visitados = {(1, 1)}
        self.seguros = {(1, 1)}
        self.ultima_acao = None
        self.fila_acoes = []
        self.tem_ouro = False
        self.wumpus_vivo = True
        self.flechas = 1
        
        todas_casas = {(x, y) for x in range(1, 5) for y in range(1, 5)}
        self.w_possiveis = todas_casas.copy()
        self.b_possiveis = todas_casas.copy()
        self.w_possiveis.discard((1, 1))
        self.b_possiveis.discard((1, 1))
        self.casas_com_brisa = set()
        self.casas_com_cheiro = set()
    
    def get_vizinhos(self, x, y):
        viz = set()
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nx, ny = x + dx, y + dy
            if 1 <= nx <= 4 and 1 <= ny <= 4:
                viz.add((nx, ny))
        return viz
    
    def atualizar_estado_interno(self, sensores):
        dx_arr = [1, 0, -1, 0]
        dy_arr = [0, 1, 0, -1]
        
        if self.ultima_acao == MOVER:
            if "CHOQUE" not in sensores:
                self.x += dx_arr[self.direcao]
                self.y += dy_arr[self.direcao]
                self.visitados.add((self.x, self.y))
                self.w_possiveis.discard((self.x, self.y))
                self.b_possiveis.discard((self.x, self.y))
        elif self.ultima_acao == VIRAR_E:
            self.direcao = (self.direcao + 1) % 4
        elif self.ultima_acao == VIRAR_D:
            self.direcao = (self.direcao - 1) % 4
        elif self.ultima_acao == ATIRAR:
            if "GRITO" not in sensores:
                tx, ty = self.x + dx_arr[self.direcao], self.y + dy_arr[self.direcao]
                self.w_possiveis.discard((tx, ty))
            
        if "GRITO" in sensores:
            self.wumpus_vivo = False

    def inferir_casas_seguras(self, sensores):
        vizinhos = self.get_vizinhos(self.x, self.y)
        
        if "BRISA" in sensores:
            self.casas_com_brisa.add((self.x, self.y))
        else:
            for v in vizinhos:
                self.b_possiveis.discard(v)
                
        if self.casas_com_brisa:
            candidatos_buraco = set.intersection(*[self.get_vizinhos(cx, cy) for cx, cy in self.casas_com_brisa])
            self.b_possiveis.intersection_update(candidatos_buraco)
            
        if "CHEIRO" in sensores and self.wumpus_vivo:
            self.casas_com_cheiro.add((self.x, self.y))
        elif self.wumpus_vivo:
            for v in vizinhos:
                self.w_possiveis.discard(v)
                
        if self.casas_com_cheiro and self.wumpus_vivo:
            candidatos_wumpus = set.intersection(*[self.get_vizinhos(cx, cy) for cx, cy in self.casas_com_cheiro])
            self.w_possiveis.intersection_update(candidatos_wumpus)

        if len(self.w_possiveis) == 1:
            self.b_possiveis.discard(list(self.w_possiveis)[0])
        if len(self.b_possiveis) == 1:
            self.w_possiveis.discard(list(self.b_possiveis)[0])

        self.seguros.clear()
        for x in range(1, 5):
            for y in range(1, 5):
                if (x, y) not in self.b_possiveis:
                    if not self.wumpus_vivo or (x, y) not in self.w_possiveis:
                        self.seguros.add((x, y))

    def planejar_rota_para(self, dest_x, dest_y):
        fila = [((self.x, self.y, self.direcao), [])]
        visitados_bfs = {(self.x, self.y, self.direcao)}
        dx_arr = [1, 0, -1, 0]
        dy_arr = [0, 1, 0, -1]
        
        while fila:
            (cx, cy, cdir), acoes = fila.pop(0)
            
            if cx == dest_x and cy == dest_y:
                return acoes
                
            nx, ny = cx + dx_arr[cdir], cy + dy_arr[cdir]
            if 1 <= nx <= 4 and 1 <= ny <= 4:
                if (nx, ny) == (dest_x, dest_y) or (nx, ny) in self.visitados:
                    if (nx, ny, cdir) not in visitados_bfs:
                        visitados_bfs.add((nx, ny, cdir))
                        fila.append(((nx, ny, cdir), acoes + [MOVER]))
                        
            ndir_e = (cdir + 1) % 4
            if (cx, cy, ndir_e) not in visitados_bfs:
                visitados_bfs.add((cx, cy, ndir_e))
                fila.append(((cx, cy, ndir_e), acoes + [VIRAR_E]))
                
            ndir_d = (cdir - 1) % 4
            if (cx, cy, ndir_d) not in visitados_bfs:
                visitados_bfs.add((cx, cy, ndir_d))
                fila.append(((cx, cy, ndir_d), acoes + [VIRAR_D]))
                
        return None
    
    def virar_para(self, dest_x, dest_y):
        dx, dy = dest_x - self.x, dest_y - self.y
        if dx == 1 and dy == 0: dir_alvo = 0
        elif dx == 0 and dy == 1: dir_alvo = 1
        elif dx == -1 and dy == 0: dir_alvo = 2
        elif dx == 0 and dy == -1: dir_alvo = 3
        else: return None
        
        if self.direcao == dir_alvo: return None
        elif (self.direcao + 1) % 4 == dir_alvo: return VIRAR_E
        elif (self.direcao - 1) % 4 == dir_alvo: return VIRAR_D
        else: return VIRAR_D
    
    def tomar_decisao(self, sensores):
        self.atualizar_estado_interno(sensores)
        
        if "BRILHO" in sensores and not self.tem_ouro:
            self.ultima_acao = AGARRAR
            self.fila_acoes = []
            return AGARRAR
            
        if "OURO" in sensores:
            self.tem_ouro = True
            self.fila_acoes = self.planejar_rota_para(1, 1) or []
            self.fila_acoes.append(ESCALAR)
            
        self.inferir_casas_seguras(sensores)

        if self.fila_acoes:
            acao = self.fila_acoes.pop(0)
            self.ultima_acao = acao
            return acao

        nao_visitados_seguros = self.seguros - self.visitados
        if nao_visitados_seguros:
            melhor_caminho = None
            for destino in nao_visitados_seguros:
                caminho = self.planejar_rota_para(destino[0], destino[1])
                if caminho is not None:
                    if melhor_caminho is None or len(caminho) < len(melhor_caminho):
                        melhor_caminho = caminho
            
            if melhor_caminho is not None:
                self.fila_acoes = melhor_caminho
                acao = self.fila_acoes.pop(0)
                self.ultima_acao = acao
                return acao

        if self.wumpus_vivo and self.flechas > 0:
            if len(self.w_possiveis) == 1:
                alvo = list(self.w_possiveis)[0]
                if alvo in self.get_vizinhos(self.x, self.y):
                    acao_tiro = self.virar_para(alvo[0], alvo[1])
                    if acao_tiro:
                        self.ultima_acao = acao_tiro
                        return acao_tiro
                    self.flechas -= 1
                    self.ultima_acao = ATIRAR
                    return ATIRAR
                else:
                    vizinhos_seguros = self.get_vizinhos(alvo[0], alvo[1]).intersection(self.visitados)
                    if vizinhos_seguros:
                        dest = list(vizinhos_seguros)[0]
                        caminho = self.planejar_rota_para(dest[0], dest[1])
                        if caminho is not None:
                            self.fila_acoes = caminho
                            acao = self.fila_acoes.pop(0)
                            self.ultima_acao = acao
                            return acao
            else:
                adjacentes_wumpus = self.w_possiveis.intersection(self.get_vizinhos(self.x, self.y))
                if adjacentes_wumpus:
                    alvo = list(adjacentes_wumpus)[0]
                    acao_tiro = self.virar_para(alvo[0], alvo[1])
                    if acao_tiro:
                        self.ultima_acao = acao_tiro
                        return acao_tiro
                    self.flechas -= 1
                    self.ultima_acao = ATIRAR
                    return ATIRAR

        adjacentes_possiveis = set()
        for vx, vy in self.visitados:
            for nx, ny in self.get_vizinhos(vx, vy):
                if (nx, ny) not in self.visitados:
                    adjacentes_possiveis.add((nx, ny))
                    
        if adjacentes_possiveis:
            def risco(casa):
                r = 0
                if casa in self.b_possiveis: r += 10
                if casa in self.w_possiveis: r += 5
                return r
            
            destinos_ordenados = sorted(list(adjacentes_possiveis), key=risco)
            for destino in destinos_ordenados:
                caminho = self.planejar_rota_para(destino[0], destino[1])
                if caminho is not None:
                    self.fila_acoes = caminho
                    acao = self.fila_acoes.pop(0)
                    self.ultima_acao = acao
                    return acao

        if (self.x, self.y) != (1, 1):
            caminho = self.planejar_rota_para(1, 1)
            if caminho is not None:
                self.fila_acoes = caminho
                acao = self.fila_acoes.pop(0)
                self.ultima_acao = acao
                return acao
                
        self.ultima_acao = MOVER
        return MOVER
    
# =====================================================================
# SISTEMA DE AVALIAÇÃO E CHAVEAMENTO (NÃO MODIFICAR ABAIXO)
# =====================================================================

def modo_master():
    agente = Agente()
    print(agente.nome, flush=True)
    while True:
        linha = sys.stdin.readline()
        if not linha:
            break
        linha = linha.strip()
        sensores = linha.split(',') if linha != "NADA" else []
        acao = agente.tomar_decisao(sensores)
        print(acao, flush=True)


def carregar_mundo_stdin():
    linhas = []
    for _ in range(4):
        linha = sys.stdin.readline()
        if not linha:
            break
        linhas.append(linha.strip().split())

    if len(linhas) < 4:
        return None

    mundo = {'wumpus': None, 'buraco': None, 'ouro': None, 'wumpus_vivo': True}
    for r in range(4):
        for c in range(4):
            val = linhas[r][c]
            x, y = c + 1, 4 - r
            if val == '#':
                mundo['wumpus'] = (x, y)
            elif val == '*':
                mundo['buraco'] = (x, y)
            elif val == '$':
                mundo['ouro'] = (x, y)
            elif val == '@':
                mundo['saida'] = (x, y)
    
    if mundo['ouro'] is None and mundo['wumpus'] is not None:
        mundo['ouro'] = mundo['wumpus']
            
    return mundo


def modo_judge_interno():
    mundo = carregar_mundo_stdin()
    if not mundo:
        print("FRACASSO")
        return

    agente = Agente()
    x, y = 1, 1
    direcao = 0
    dx, dy = [1, 0, -1, 0], [0, 1, 0, -1]

    flechas = 2
    tem_ouro = False
    jogo_ativo = True
    resultado_final = "FRACASSO"

    bateu_parede = False
    gritou = False
    pegou_ouro = False
    erro_escada = False
    entrou_sala_ouro = False

    turnos = 0
    while jogo_ativo and turnos < 500:
        turnos += 1

        if (x, y) == mundo['wumpus'] and mundo['wumpus_vivo']:
            break
        if (x, y) == mundo['buraco']:
            break

        sensores = []
        adjacentes = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
        if mundo['buraco'] in adjacentes:
            sensores.append("BRISA")
        if mundo['wumpus_vivo'] and mundo['wumpus'] in adjacentes:
            sensores.append("CHEIRO")
        if entrou_sala_ouro:
            sensores.append("BRILHO")
            entrou_sala_ouro = False
        if bateu_parede:
            sensores.append("CHOQUE")
            bateu_parede = False
        if gritou:
            sensores.append("GRITO")
            gritou = False
        if pegou_ouro:
            sensores.append("OURO")
            pegou_ouro = False
        if erro_escada:
            sensores.append("NO ESCADA")
            erro_escada = False

        acao = agente.tomar_decisao(sensores)

        if acao == MOVER:
            nx, ny = x + dx[direcao], y + dy[direcao]
            if 1 <= nx <= 4 and 1 <= ny <= 4:
                x, y = nx, ny
                if (x, y) == mundo['ouro'] and not tem_ouro:
                    entrou_sala_ouro = True
            else:
                bateu_parede = True
        elif acao == VIRAR_E:
            direcao = (direcao + 1) % 4
        elif acao == VIRAR_D:
            direcao = (direcao - 1) % 4
        elif acao == ATIRAR:
            if flechas > 0:
                flechas -= 1
                tx, ty = x + dx[direcao], y + dy[direcao]
                if (tx, ty) == mundo['wumpus'] and mundo['wumpus_vivo']:
                    mundo['wumpus_vivo'] = False
                    gritou = True
        elif acao == AGARRAR:
            if (x, y) == mundo['ouro'] and not tem_ouro:
                tem_ouro = True
                pegou_ouro = True
        elif acao == ESCALAR:
            if (x, y) == (1, 1):
                if tem_ouro:
                    resultado_final = "SUCESSO"
                    jogo_ativo = False
                else:
                    erro_escada = True

    print(resultado_final)


if __name__ == "__main__":
    if "--master" in sys.argv:
        modo_master()
    else:
        modo_judge_interno()