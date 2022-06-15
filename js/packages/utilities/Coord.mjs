import { TETRIS_HEIGHT,TETRIS_WIDTH } from "../constants/Constants.mjs";

export default class Coord
{
  #x;
  #y;

  constructor(x,y)
  {
    if(x < 0) throw new RangeError("Coordenada X não pode ser menor que 0!");
    if(x >= TETRIS_WIDTH) throw new RangeError("Coordenada X ultrapassou o limite!");
    this.#x = x;
    if(y < 0) throw new RangeError("Coordenada Y não pode ser menor que 0!");
    if(y >= TETRIS_HEIGHT) throw new RangeError("Coordenada Y ultrapassou o limite!");
    this.#y = y;
  }

  getX()
  {
    return this.#x;
  }

  getY()
  {
    return this.#y;
  }

  toString()
  {
    return `Coord(${this.#x},${this.#y})`;
  }
}