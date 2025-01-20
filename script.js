




document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('turtleCanvas');
    const ctx = canvas.getContext('2d');
    const turtleImage = new Image();
    turtleImage.src = 'tartaruga.png'; // Certifique-se de que o nome do arquivo da imagem seja correto
    let comandos = [];
    let estados = [];
    let tartaruga = { x: 300, y: 300, angulo: 0, penDown: true };

    turtleImage.onload = () => {
        desenharTartaruga(); // Desenhar a tartaruga inicial quando a imagem carregar
    };

    function moverParaFrente(distancia) {
        const anguloRad = (tartaruga.angulo * Math.PI) / 180;
        const novoX = tartaruga.x + distancia * 10 * Math.cos(anguloRad);
        const novoY = tartaruga.y + distancia * 10 * Math.sin(anguloRad); // Ajuste aqui para eixo Y correto
        if (tartaruga.penDown) {
            ctx.beginPath();
            ctx.moveTo(tartaruga.x, tartaruga.y);
            ctx.lineTo(novoX, novoY);
            ctx.stroke();
        }
        tartaruga.x = novoX;
        tartaruga.y = novoY;
        estados.push({ ...tartaruga }); // Adicionar estado atualizado imediatamente
        desenharTartaruga(); // Atualizar a posição da tartaruga
    }

    function girarDireita(angulo) {
        tartaruga.angulo += angulo;
        desenharTartaruga(); // Atualizar a posição da tartaruga
    }

    function girarEsquerda(angulo) {
        tartaruga.angulo -= angulo;
        desenharTartaruga(); // Atualizar a posição da tartaruga
    }

    function levantarCaneta() {
        tartaruga.penDown = false;
    }

    function baixarCaneta() {
        tartaruga.penDown = true;
    }

    function adicionarComando(comando) {
        comandos.push(comando);
        estados.push({ ...tartaruga });
        atualizarListaComandos();
    }

    function executarComando() {
        const comando = document.getElementById('commandInput').value.toLowerCase().trim();
        const comandosLista = comando.split('>');

        for (const cmd of comandosLista) {
            const partes = cmd.trim().split(' ');
            if (partes.length >= 2) {
                const acao = partes[0];
                const valor = parseFloat(partes[1]); // Alterado para aceitar decimais
                if (acao === 'mover') {
                    adicionarComando(`Mover ${valor} cm`);
                    moverParaFrente(valor);
                } else if (acao === 'girar' && partes.length === 4) {
                    const direcao = partes[3];
                    if (direcao === 'direita') {
                        adicionarComando(`Girar ${valor} graus à direita`);
                        girarDireita(valor);
                    } else if (direcao === 'esquerda') {
                        adicionarComando(`Girar ${valor} graus à esquerda`);
                        girarEsquerda(valor);
                    }
                } else if (acao === 'levantar') {
                    adicionarComando('Levantar caneta');
                    levantarCaneta();
                } else if (acao === 'baixar') {
                    adicionarComando('Baixar caneta');
                    baixarCaneta();
                }
            }
        }
        document.getElementById('commandInput').value = '';
    }

    function atualizarListaComandos() {
        const listaComandos = document.getElementById('commandList');
        listaComandos.value = '';
        comandos.forEach((comando, index) => {
            listaComandos.value += `${index + 1}. ${comando}\n`;
        });
    }

    function limparUltimoComando() {
        if (comandos.length) {
            comandos.pop();
            estados.pop();
            const ultimoEstado = estados.length ? estados[estados.length - 1] : { x: 300, y: 300, angulo: 0, penDown: true };
            tartaruga = { ...ultimoEstado };
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            estados.forEach((estado, index) => {
                if (index > 0) {
                    const prev = estados[index - 1];
                    if (estado.penDown) {
                        ctx.beginPath();
                        ctx.moveTo(prev.x, prev.y);
                        ctx.lineTo(estado.x, estado.y);
                        ctx.stroke();
                    }
                }
            });
            desenharTartaruga();
            atualizarListaComandos();
        }
    }

    function desenharTartaruga() {
        // Limpar o canvas antes de desenhar a nova posição da tartaruga
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redesenhar todas as linhas anteriores
        estados.forEach((estado, index) => {
            if (index > 0) {
                const prev = estados[index - 1];
                if (estado.penDown) {
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(estado.x, estado.y);
                    ctx.stroke();
                }
            }
        });
        // Desenhar tartaruga na posição atual
        ctx.save();
        ctx.translate(tartaruga.x, tartaruga.y);
        ctx.rotate((tartaruga.angulo * Math.PI) / 180);
        ctx.drawImage(turtleImage, -15, -15, 30, 30); // Ajustar a posição da imagem para centralizar a tartaruga
        ctx.restore();
    }

    document.getElementById('executeButton').addEventListener('click', executarComando);
    document.getElementById('clearButton').addEventListener('click', limparUltimoComando);

    // Desenhar a tartaruga inicial
    desenharTartaruga();
});
