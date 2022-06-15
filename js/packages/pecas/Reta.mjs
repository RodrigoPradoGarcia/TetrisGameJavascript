import Peca from "./Peca.mjs";
import Coord from '../utilities/Coord.mjs';

export default class Reta extends Peca
{
  constructor(collide,coordenada)
  {
    super(collide);
    this.setQuadrados([coordenada,new Coord(coordenada.getX()+1,coordenada.getY()), new Coord(coordenada.getX()+2,coordenada.getY()), new Coord(coordenada.getX()+3,coordenada.getY())]);
    this.setDirecao(1);
  }

  //Sobrescrita
  virar()
  {
    if(this.getFlipCallback()(this.flipSnapshot()))
    {
      if(this.getDirecao() === 1)
      {
        this.setDirecao(2);
        const c = this.getQuadrados()[0];
        this.setQuadrados([c,new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2), new Coord(c.getX(),c.getY()+3)]);
      }
      else
      {
        this.setDirecao(1);
        const c = this.getQuadrados()[0];
        this.setQuadrados([c,new Coord(c.getX()+1,c.getY()), new Coord(c.getX()+2,c.getY()), new Coord(c.getX()+3,c.getY())]);
      }
    }
  }

  //Sobrescrita
  flipSnapshot()
  {
    if(this.getDirecao() === 1)
    {
      const c = this.getQuadrados()[0];
      return [c,new Coord(c.getX(),c.getY()+1), new Coord(c.getX(),c.getY()+2), new Coord(c.getX(),c.getY()+3)];
    }
    else
    {
      const c = this.getQuadrados()[0];
      return [c,new Coord(c.getX()+1,c.getY()), new Coord(c.getX()+2,c.getY()), new Coord(c.getX()+3,c.getY())];
    }
  }
}