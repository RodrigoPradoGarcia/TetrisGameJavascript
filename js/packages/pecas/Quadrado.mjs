import Peca from "./Peca.mjs";
import Coord from '../utilities/Coord.mjs';

export default class Quadrado extends Peca
{
  constructor(collide,coordenada)
  {
    super(collide);
    this.setQuadrados([coordenada, new Coord(coordenada.getX() + 1,coordenada.getY()), new Coord(coordenada.getX(),coordenada.getY() + 1), new Coord(coordenada.getX()+1,coordenada.getY()+1)]);
    this.setDirecao(1);
  }

  //Sobrescrita
  virar(){}

  //Sobrescrita
  flipSnapshot()
  {
    return this.getQuadrados();
  }
}