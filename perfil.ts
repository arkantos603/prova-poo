import { Postagem } from "./postagem";
export class Perfil {
    private _id: number;
    private _nome: string;
    private _email: string;
    private _postagens: Postagem[] = [];
  
    constructor(id: number, nome: string, email: string) {
      this._id = id;
      this._nome = nome;
      this._email = email;
    }
  
    get id(): number {
      return this._id;
    }
  
    get nome(): string {
      return this._nome;
    }
  
    get email(): string {
      return this._email;
    }
  
    get postagens(): Postagem[] {
      return this._postagens;
    }
  }