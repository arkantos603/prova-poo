import { Postagem } from "./postagem";
import { PostagemAvancada } from "./postagemAvancada";
import {Perfil} from "./perfil"
export class RepositorioDePostagens {
    private _postagens: Postagem[] = [];
    
    get postagens(): Postagem[] {
      return this._postagens;
    }
  
    incluir(postagem: Postagem): void {
      this._postagens.push(postagem);
      if (postagem.perfil) {
        postagem.perfil.postagens.push(postagem);
      }
    }
  
    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] {
      return this._postagens.filter((postagem) => {
        if (id !== undefined && postagem.id !== id) {
          return false;
        }
  
        if (texto !== undefined && !postagem.texto.includes(texto)) {
          return false;
        }
  
        if (hashtag !== undefined && postagem instanceof PostagemAvancada) {
          const postagemAvancada = postagem as PostagemAvancada;
          if (!postagemAvancada._hashtags.includes(hashtag)) {
            return false;
          }
        }
  
        if (perfil !== undefined && postagem.perfil !== perfil) {
          return false;
        }
  
        return true;
      });
    }
  
    exibirTodasAsPostagens(): Postagem[] {
      return this._postagens;
    }
  }