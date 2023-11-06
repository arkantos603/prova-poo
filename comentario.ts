import {Perfil} from "./perfil"
export class Comentario {
    private _id: number;
    private _texto: string;
    private _perfil: Perfil;
  
    constructor(id: number, texto: string, perfil: Perfil) {
      this._id = id;
      this._texto = texto;
      this._perfil = perfil;
    }
  
    get id(): number {
      return this._id;
    }
  
    get texto(): string {
      return this._texto;
    }
  
    get perfil(): Perfil {
      return this._perfil;
    }
  }