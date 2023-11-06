import { Postagem } from "./postagem";
import {Perfil} from "./perfil"

export class PostagemAvancada extends Postagem {
    public _hashtags: string[];
    public _visualizacoesRestantes: number;
  
    constructor(
      id: number,
      texto: string,
      curtidas: number,
      descurtidas: number,
      data: Date,
      perfil: Perfil,
      hashtags: string[],
      visualizacoesRestantes: number
      ) {
        super(id, texto, curtidas, descurtidas, data, perfil);
        this._hashtags = hashtags;
        this._visualizacoesRestantes = visualizacoesRestantes;
      }
      
      get hashtags(): string[] {
      return this._hashtags;
    }
    
    get visualizacoesRestantes(): number {
      return this._visualizacoesRestantes;
    }
    
    adicionarHashtag(hashtag: string): void {
      this._hashtags.push(hashtag);
    }
  
    existeHashtag(hashtag: string): boolean {
      return this._hashtags.includes(hashtag);
    }
    
    decrementarVisualizacoes(): void {
      if (this._visualizacoesRestantes > 0) {
        this._visualizacoesRestantes--;
      }
    }
  }