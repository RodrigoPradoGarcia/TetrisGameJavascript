import Peca from "./Peca.mjs";
import Coord from '../utilities/Coord.mjs';

export default class LPeca extends Peca
{
  constructor(collide,coordenada)
  {
    /*
    xoo
      o
    */
    super(collide);
    this.setQuadrados([coordenada,new Coord(coordenada.getX()+1,coordenada.getY()), new Coord(coordenada.getX()+2,coordenada.getY()), new Coord(coordenada.getX()+2,coordenada.getY()+1)]);
    this.setDirecao(1);
  }

  //Sobrescrita
  virar()
  {
    if(this.getFlipCallback()(this.flipSnapshot()))
    {
      if(this.getDirecao() === 1)
      {
        /*
        xo
        o
        o
        */
        this.setDirecao(2);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX(),c.getY()),new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2)]);
      }
      else if(this.getDirecao() === 2)
      {
        /*
        x
        ooo
        */
        this.setDirecao(3);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX(),c.getY()),new Coord(c.getX(),c.getY()+1), new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+2,c.getY()+1)]);
      }
      else if(this.getDirecao() === 3)
      {
        /*
        xo
         o
        oo
        */
        this.setDirecao(4);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX()+1,c.getY()),new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+1,c.getY()+2), new Coord(c.getX(),c.getY()+2)]);
      }
      else
      {
        /*
        oxo
          o
        */
        this.setDirecao(1);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX()-1,c.getY()),new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()), new Coord(c.getX()+1,c.getY()+1)]);
      }
    }
  }

  //Sobrescrita
  flipSnapshot()
  {
    if(this.getDirecao() === 1)
      {
        /*
        xo
        o
        o
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX(),c.getY()),new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2)];
      }
      else if(this.getDirecao() === 2)
      {
        /*
        x
        ooo
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX(),c.getY()),new Coord(c.getX(),c.getY()+1), new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+2,c.getY()+1)];
      }
      else if(this.getDirecao() === 3)
      {
        /*
        xo
         o
        oo
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX()+1,c.getY()),new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+1,c.getY()+2), new Coord(c.getX(),c.getY()+2)];
      }
      else
      {
        /*
        oxo
          o
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX()-1,c.getY()),new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()), new Coord(c.getX()+1,c.getY()+1)];
      }
    }
}