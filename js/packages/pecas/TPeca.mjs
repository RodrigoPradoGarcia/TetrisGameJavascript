import Peca from "./Peca.mjs";
import Coord from '../utilities/Coord.mjs';

export default class TPeca extends Peca
{
  constructor(collide,coordenada)
  {
    super(collide);
    this.setQuadrados([coordenada,new Coord(coordenada.getX(),coordenada.getY()+1), new Coord(coordenada.getX(),coordenada.getY()+2), new Coord(coordenada.getX()+1,coordenada.getY()+1)]);
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
        ooo
        */
        this.setDirecao(2);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX()+1,c.getY()),new Coord(c.getX(),c.getY()+1), new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+2,c.getY()+1)]);
      }
      else if(this.getDirecao() === 2)
      {
        /*
         x
        oo
         o
        */
        this.setDirecao(3);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX(),c.getY()),new Coord(c.getX()-1,c.getY()+1), new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2)]);
      }
      else if(this.getDirecao() === 3)
      {
        /*
        oxo
         o
        */
        this.setDirecao(4);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX(),c.getY()),new Coord(c.getX()-1,c.getY()), new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()+1)]);
      }
      else
      {
        /*
        ox
        oo
        o
        */
        this.setDirecao(1);
        const c = this.getQuadrados()[0];
        this.setQuadrados([new Coord(c.getX()-1,c.getY()),new Coord(c.getX()-1,c.getY()+1), new Coord(c.getX(),c.getY()+1), new Coord(c.getX()-1,c.getY()+2)]);
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
        ooo
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX()+1,c.getY()),new Coord(c.getX(),c.getY()+1), new Coord(c.getX()+1,c.getY()+1), new Coord(c.getX()+2,c.getY()+1)];
      }
      else if(this.getDirecao() === 2)
      {
        /*
         x
        oo
         o
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX(),c.getY()),new Coord(c.getX()-1,c.getY()+1), new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2)];
      }
      else if(this.getDirecao() === 3)
      {
        /*
        oxo
         o
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX(),c.getY()),new Coord(c.getX()-1,c.getY()), new Coord(c.getX()+1,c.getY()), new Coord(c.getX(),c.getY()+1)];
      }
      else
      {
        /*
        ox
        oo
        o
        */
        const c = this.getQuadrados()[0];
        return [new Coord(c.getX()-1,c.getY()),new Coord(c.getX()-1,c.getY()+1), new Coord(c.getX(),c.getY()+1), new Coord(c.getX()-1,c.getY()+2)];
      }
  }
}