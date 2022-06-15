import Coord from "./packages/utilities/Coord.mjs";
import Reta from "./packages/pecas/Reta.mjs";
import Quadrado from "./packages/pecas/Quadrado.mjs";
import ZigZag from "./packages/pecas/ZigZag.mjs";
import TPeca from "./packages/pecas/TPeca.mjs";
import LPeca from "./packages/pecas/LPeca.mjs";
import LPecaReversed from "./packages/pecas/LPecaReversed.mjs";
import {SQUARE_SIZE,TETRIS_HEIGHT,TETRIS_WIDTH,MOVEMENT_DELAY} from './packages/constants/Constants.mjs';

const theMaxScore = new Proxy(document.querySelector("#maxScore"),{
  get(obj,key)
  {
    if(key === 'value')
    {
      return parseInt(obj.innerHTML);
    }
    return obj[key];
  },
  set(obj,key,value)
  {
    if(key === 'value')
    {
      obj.innerHTML = value;
    }
    return true;
  }
});

const score = new Proxy(document.querySelector("#score"),{
  set(obj,key,value)
  {
    if(key == 'value')
    {
      obj.innerHTML = value;
      let maxScore = parseInt(localStorage.getItem('maxScore'));
      if(!maxScore)
      {
        maxScore = 0;
      }
      
      if(obj.innerHTML > maxScore)
      {
        localStorage.setItem('maxScore',obj.innerHTML);
      }
      theMaxScore.value = maxScore + 4;
    }
    obj[key] = value;
    return true;
  },
  get(obj,key)
  {
    if(key == 'value')
    {
      return parseInt(obj.innerHTML);
    }
    return obj[key];
  }
});

theMaxScore.value = localStorage.getItem('maxScore');

class TetrisCanvas
{
  #context;
  #element;
  #pecas;
  descica;
  #matriz;

  constructor()
  {
    this.#element = document.querySelector("#mainCanvas");
    this.#context = this.#element.getContext("2d");
    this.#pecas = [];
    this.addRandomPiece();
    this.addEventListeners();
    this.draw();
    this.#matriz = new Array(TETRIS_HEIGHT);
    for(let i=0;i<TETRIS_HEIGHT;i++)
    {
      this.#matriz[i] = new Array(TETRIS_WIDTH).fill(0);
      this.#matriz[i][this.#matriz[i].length] = 1; 
    }
    this.#matriz.push(new Array(TETRIS_WIDTH).fill(1));
    this.descida = setInterval(()=>{
      this.#pecas.descer();
      this.draw();
      this.checkCompletedLines();
    },MOVEMENT_DELAY);
  }

  destroy()
  {
    clearInterval(this.descida);
    this.descida = null;
    this.#context = null;
    this.#element = null;
    this.#pecas.destroy();
    this.#pecas = null;
    this.#matriz = null;
  }

  addRandomPiece()
  {
    let quadrado;
    switch(Math.floor(Math.random()*(6-1+1)+1))
    {
      case 1:
      quadrado = new Reta((quadrados)=>{
        let hasCollided = false;
        for(let quadrado of quadrados)
        {
          hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
        }
        return hasCollided;
      },new Coord(3,0)); 
      break;

      case 2:
      quadrado = new Quadrado((quadrados)=>{
        let hasCollided = false;
        for(let quadrado of quadrados)
        {
          hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
        }
        return hasCollided;
      },new Coord(3,0)); 
      break;    

      case 3:
      quadrado = new ZigZag((quadrados)=>{
        let hasCollided = false;
        for(let quadrado of quadrados)
        {
          hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
        }
        return hasCollided;
      },new Coord(3,0)); 
      break; 
           
      case 4:
      quadrado = new TPeca((quadrados)=>{
        let hasCollided = false;
        for(let quadrado of quadrados)
        {
          hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
        }
        return hasCollided;
      },new Coord(3,0)); 
      break;
      
      case 5:
        quadrado = new LPeca((quadrados)=>{
          let hasCollided = false;
          for(let quadrado of quadrados)
          {
            hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
          }
          return hasCollided;
        },new Coord(3,0)); 
        break;

      case 6:
        quadrado = new LPecaReversed((quadrados)=>{
          let hasCollided = false;
          for(let quadrado of quadrados)
          {
            hasCollided = hasCollided || this.#matriz[quadrado.getY()+1][quadrado.getX()]===1;
          }
          return hasCollided;
        },new Coord(3,0)); 
        break;
    }

    quadrado.isGameOver((quadrados)=>{
      for(let qua of quadrados)
      {
        if(this.#matriz)
        {
          if(this.#matriz[qua.getY()][qua.getX()] === 1)return true;
        }
      }
      return false;
    });

    quadrado.onGameOver((peca)=>{
      document.getElementById("gameover").classList.remove("d-none");
      clearInterval(this.descida);
      const audio = new Audio('../assets/audio/gameOverAudio.wav');
      audio.play();
      document.querySelector('.scoreContainer').classList.remove('transparent');
    });

    quadrado.checkGameOver();

    quadrado.onCollide((quadrado)=>{
      for(let q of quadrado.getQuadrados())
      {
        this.#matriz[q.getY()][q.getX()] = 1;
      }
      quadrado.destroy();
      this.addRandomPiece();
      const collideAudio = new Audio('../assets/audio/virarAudio.wav');
      collideAudio.play();
      score.value += 4;
    });

    quadrado.shouldMoveLeft((quadrados)=>{
      for(let q of quadrados)
      {
        if(this.#matriz[q.getY()][q.getX()-1] === 1)return false;
      }
      return true;
    });

    quadrado.shouldMoveRight((quadrados)=>{
      for(let q of quadrados)
      {
        if(this.#matriz[q.getY()][q.getX()+1] === 1)return false;
      }
      return true;
    });

    quadrado.shouldFlip((snapshot)=>{
      for(let q of snapshot)
      {
        if(this.#matriz[q.getY()][q.getX()] === 1)return false;
      }
      return true;
    });

    this.#pecas = quadrado;
  }

  moveLeft()
  {
    this.#pecas.moveLeft();
    this.draw();
  }

  moveRight()
  {
    this.#pecas.moveRight();
    this.draw();
  }

  flip()
  {
    this.#pecas.virar();
    this.draw();
    const flipAudio = new Audio('../assets/audio/buttonAudio.wav');
    flipAudio.play();
  }

  turbo()
  {
    this.#pecas.turboMode();
    this.draw();
    const audio = new Audio('../assets/audio/shot.wav');
    audio.play();
  }

  listenEvents(e){
    if(e.code === 'ArrowLeft')
    {
      this.moveLeft();
    }
    else if(e.code === 'ArrowRight')
    {
      this.moveRight();
    }
    else if(e.code === 'Space')
    {
      try
      {
        this.flip();
      }
      catch(e){}
    }
    else if(e.code === 'ArrowDown')
    {
      this.turbo();
    }
    else
    {
      //console.log(e.code);
    }
  }

  addEventListeners()
  {
    document.body.addEventListener("keyup",this.listenEvents.bind(this));
  }

  checkCompletedLines()
  {
    this.#matriz.forEach((linha,i)=>{
      if(i<16)
      {
        let isCompletelyFilled = true;
        for(let coluna of linha)
        {
          if(coluna === 0)
          {
            isCompletelyFilled = false;
            break;
          }
        }

        if(isCompletelyFilled)
        {
          this.destroyLine();
        }
      }
    });
  }

  destroyLine()
  {
    this.#matriz = this.#matriz.filter((linha)=>{
      let isFilled = true;
      linha.forEach((coluna)=>{
        isFilled = isFilled && coluna == 1;
      });
      return !isFilled;
    });
    while(this.#matriz.length < TETRIS_HEIGHT)
    {
      this.#matriz.unshift(new Array(TETRIS_WIDTH).fill(0));
    }
    this.#matriz.push(new Array(TETRIS_WIDTH).fill(1));
    const audio = new Audio('../assets/audio/linhaAudio.wav');
    audio.play();
  }

  draw()
  {
    const ctx = this.#context;
    ctx.clearRect(0,0,TETRIS_WIDTH * SQUARE_SIZE,TETRIS_HEIGHT * SQUARE_SIZE);    
    ctx.fillStyle = "#333";
    ctx.fillRect(0,0,TETRIS_WIDTH * SQUARE_SIZE,TETRIS_HEIGHT * SQUARE_SIZE);
    if(this.#matriz)
    {
      this.#matriz.forEach((linha,i)=>{
        linha.forEach((coluna,j)=>{
          if(coluna===1)
          {
            ctx.fillStyle = "#731251";
            ctx.strokeStyle = "black";
            ctx.fillRect(SQUARE_SIZE*j,SQUARE_SIZE*i,SQUARE_SIZE,SQUARE_SIZE);
            ctx.strokeRect(SQUARE_SIZE*j,SQUARE_SIZE*i,SQUARE_SIZE,SQUARE_SIZE);
          }
        });
      });
      this.#pecas.draw(this.#context);
    }
  }
}

let tetris = new TetrisCanvas();

document.querySelectorAll(".div-botoes button").forEach((elemento)=>{
  elemento.addEventListener('touchstart',()=>{
    elemento.classList.add("no-shadow");
  });

  elemento.addEventListener('touchend',()=>{
    elemento.classList.remove("no-shadow");
  });
});

document.querySelector(".div-botoes button:nth-child(1)").addEventListener("click",()=>{
  tetris.moveLeft();
});

document.querySelector(".div-botoes button:nth-child(2)").addEventListener("click",()=>{
  tetris.flip();
});

document.querySelector(".div-botoes button:nth-child(3)").addEventListener("click",()=>{
  tetris.moveRight();
});

document.querySelector('.scoreContainer').addEventListener('click',()=>{
  tetris.turbo();
});

document.querySelector("#pilha").addEventListener('click',()=>{
  tetris.turbo();
});

document.querySelector("#gameoverbutton").addEventListener('click',()=>{
  tetris.destroy();
  window.location.reload();
});