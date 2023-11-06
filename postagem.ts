import {Perfil} from "./perfil"
import { Comentario} from "./comentario";
export class Postagem {
    private _id: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date;
    private _perfil: Perfil;
    private _comentarios: Comentario[] = [];
    
  
  
    constructor(id: number, texto: string, curtidas: number, descurtidas: number, data: Date, perfil: Perfil) {
      this._id = id;
      this._texto = texto;
      this._curtidas = curtidas;
      this._descurtidas = descurtidas;
      this._data = data;
      this._perfil = perfil;
    }
  
    get id(): number {
      return this._id;
    }
  
    get texto(): string {
      return this._texto;
    }
  
    get curtidas(): number {
      return this._curtidas;
    }
  
    get descurtidas(): number {
      return this._descurtidas;
    }
  
    get data(): Date {
      return this._data;
    }
  
    get perfil(): Perfil {
      return this._perfil;
    }
    
    get comentarios(): Comentario[] {
      return this._comentarios;
    }
  
    curtir(): void {
      this._curtidas++;
    }
  
    descurtir(): void {
      this._descurtidas++;
    }
  
    ehPopular(): boolean {
      return this._curtidas > 1.5 * this._descurtidas;
    }
  
    adicionarComentario(id: number, texto: string, perfil: Perfil): void {
      const comentario = new Comentario(id, texto, perfil);
      this._comentarios.push(comentario);
    }
  
    excluirComentario(idComentario: number): void {
      const index = this.comentarios.findIndex((comentario) => comentario.id === idComentario);
    
      if (index !== -1) {
        this.comentarios.splice(index, 1);
        console.log("Comentário excluído com sucesso.");
      } else {
        console.log("Erro: Comentário não encontrado.");
      }
    }
  
  }