import {TETRIS_HEIGHT,TETRIS_WIDTH,SQUARE_SIZE,MOVEMENT_DELAY} from '../constants/Constants.mjs';
import Coord from '../utilities/Coord.mjs';

//Abstract Class
export default class Peca
{
  //callback que retorna um booleano indicando se a paça colidiu
  #collide;

  //um inteiro representando a direção que a peça está virada
  #direcao;

  //representa cada quadradinho da peça de tetris
  #quadrados;

  //cor da peça(gerada aleatoriamente)
  #cor;

  //Intervalo que executa a função #collide
  #collisionInterval;

  //callback que é chamada cado a peça colidir
  #onCollide

  //callback que determina se a peça tem espaço para mover para a esquerda
  #moveLeft;

  //callback que determina se a peça tem espaço para mover para a direita
  #moveRight;

  //intervalo que faz a peça descer mais rápido
  #turboInterval;

  //callback que retorna um boolean indicando se a peça tem espaço suficiente para virar
  #shouldFlipCallback;

  //Executa callback quando houver GameOver
  #onGameOver;

  //callback que retorna um boolean indicando se houve GameOver
  #isGameOverCallback;

  constructor(collide)
  {
    this.#collide = collide;
    this.#cor = "#" + Math.random().toString(16).slice(-6);
    this.#collisionInterval = setInterval(()=>{
      if(this.#collide(this.#quadrados))
      {
        clearInterval(this.#collisionInterval);
        if(this.#turboInterval)clearInterval(this.#turboInterval);
        if(this.#onCollide)this.#onCollide(this);
      }
    },MOVEMENT_DELAY);
  }

  destroy()
  {
    this.#collide = null;
    this.#direcao = null;
    this.#quadrados = null;
    this.#cor = null;
    clearInterval(this.#collisionInterval);
    this.#onCollide = null;
    this.#moveLeft = null;
    this.#moveRight = null;
    clearInterval(this.#turboInterval);
    this.#shouldFlipCallback = null;
    this.#onGameOver = null;
    this.#isGameOverCallback = null;
  }

  isGameOver(callback)
  {
    this.#isGameOverCallback = callback;
  }

  checkGameOver()
  {
    if(this.#isGameOverCallback)
    {
      if(this.#isGameOverCallback(this.getQuadrados()))
      {
        clearInterval(this.#collisionInterval);
        if(this.#turboInterval)clearInterval(this.#turboInterval);
        this.#onGameOver(this);
      }
    }
  }

  onGameOver(callback)
  {
    this.#onGameOver = callback;
  }

  turboMode()
  {
    
    window.requestAnimationFrame((function animar(){
      if(!this.#collide(this.#quadrados.map(q=>new Coord(q.getX(),q.getY()+1))))
      {
        this.descer();
        this.draw(document.querySelector("#mainCanvas").getContext("2d"));
        setTimeout(()=>{
          animar.bind(this)();
        },30);
      }  
    }).bind(this));
    
   /* 
    while(!this.#collide(this.#quadrados))
    {
      this.descer();      
      this.draw(document.querySelector("#mainCanvas").getContext("2d"));
    }*/

    let maxY;
    this.#quadrados.forEach(q=>{
      maxY = Math.max(maxY,q.getY());
    });
    if(maxY != TETRIS_HEIGHT-1)
    {
      this.#quadrados = this.#quadrados.map(qdd=>{
        return new Coord(qdd.getX(),qdd.getY());
      });
    }
    /*this.#turboInterval = setInterval(()=>{
      this.descer();
    },MOVEMENT_DELAY);   
    */
  }

  onCollide(callback)
  {
    this.#onCollide = callback;
  }

  //retorna a nova posição da peça(mas não a vira)
  //Abstract Method
  flipSnapshot(){throw new Error("Método abstrato flipSpanshot() não foi implementado na classe " + this.constructor.name)}

  //vira a peça
  //Abstract Method
  virar(){throw new Error("Método abstrato virar() não foi implementado na classe " + this.constructor.name);}

  descer()
  {
    try
    {
      if(!this.#collide(this.#quadrados))
      {
        this.#quadrados = this.#quadrados.map(q=>new Coord(q.getX(),q.getY()+1));
      }
    }
    catch(e){}
  }

  shouldMoveLeft(callback)
  {
    this.#moveLeft = callback;
  }

  shouldMoveRight(callback)
  {
    this.#moveRight = callback;
  }

  shouldFlip(callback)
  {
    this.#shouldFlipCallback = callback;
  }

  moveLeft()
  {
    const minXC = this.#quadrados.reduce( (cum,value) => Math.min(cum,value.getX()) , TETRIS_WIDTH-1 );

    if(minXC > 0 && this.#moveLeft(this.#quadrados))
    {
      this.#quadrados = this.#quadrados.map(q=>new Coord(q.getX()-1,q.getY()));
    }
  }

  moveRight()
  {
      const maxXC = this.#quadrados.reduce( (cum,value) => {return Math.max(cum,value.getX())} , 0 );
  
      if(maxXC + 1 < TETRIS_WIDTH && this.#moveRight(this.#quadrados))
      {
        this.#quadrados = this.#quadrados.map(q=>new Coord(q.getX()+1,q.getY()));
      }
  }

  draw(ctx)
  {
    ctx.fillStyle = this.#cor;
    ctx.strokeStyle = "#ffffffaa";
    ctx.lineWidth = 5;
    
    for(let quadrado of this.#quadrados)
    {
      const xCoord = SQUARE_SIZE * quadrado.getX();
      const yCoord = SQUARE_SIZE * quadrado.getY();
      ctx.fillRect(xCoord,yCoord,SQUARE_SIZE,SQUARE_SIZE);
    }

    for(let quadrado of this.#quadrados)
    {
      const xCoord = SQUARE_SIZE * quadrado.getX();
      const yCoord = SQUARE_SIZE * quadrado.getY();
      ctx.strokeRect(xCoord,yCoord,SQUARE_SIZE,SQUARE_SIZE);
    }
  }

  getDirecao()
  {
    return this.#direcao;
  }

  getQuadrados()
  {
    return this.#quadrados;
  }

  getFlipCallback()
  {
    return this.#shouldFlipCallback;
  }

  setDirecao(valor)
  {
    this.#direcao = valor;
  }

  setQuadrados(valor)
  {
    this.#quadrados = valor;
  }

  toString()
  {
    return JSON.stringify(this);
  }
}