import { Postagem } from "./postagem";
import { PostagemAvancada } from "./postagemAvancada";
import {Perfil} from "./perfil"
import { RepositorioDePerfis } from "./repositorioPerfis";
import { RepositorioDePostagens } from "./repositorioPostagem";
export class RedeSocial {
    private _repositorioDePostagens: RepositorioDePostagens;
    private _repositorioDePerfis: RepositorioDePerfis;
  
    constructor() {
      this._repositorioDePostagens = new RepositorioDePostagens();
      this._repositorioDePerfis = new RepositorioDePerfis();
    }
  
    incluirPerfil(perfil: Perfil): void {
      if (!perfil.id || !perfil.nome || !perfil.email) {
        console.log("Erro: Todos os atributos do perfil devem ser preenchidos.");
        return;
      }
  
      if (
        this._repositorioDePerfis.consultar(perfil.id) ||
        this._repositorioDePerfis.consultar(undefined, perfil.nome) ||
        this._repositorioDePerfis.consultar(undefined, undefined, perfil.email)
      ) {
        console.log("Erro: Já existe um perfil com o mesmo ID, nome ou email.");
        return;
      }
  
      this._repositorioDePerfis.incluir(perfil);
      console.log("Perfil criado com sucesso. Seja bem vindo!");
    }
  
    consultarPerfil(id?: number, nome?: string, email?: string): Perfil | null {
      return this._repositorioDePerfis.consultar(id, nome, email);
    }
  
    incluirPostagem(postagem: Postagem): void {
      if (!postagem.id || !postagem.texto || postagem.curtidas === undefined || postagem.descurtidas === undefined || !postagem.data || !postagem.perfil) {
        console.log("Erro: Todos os atributos devem ser preenchidos.");
        return;
      }
  
      if (this._repositorioDePostagens.consultar(postagem.id).length > 0) {
        console.log("Erro: Já existe uma postagem com o mesmo ID.");
        
        return;
      }
  
      this._repositorioDePostagens.incluir(postagem);
      console.log("Postagem criada com sucesso.");
    }
  
    consultarPostagens(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] {
      const postagens = this._repositorioDePostagens.consultar(id, texto, hashtag, perfil);
    
      postagens.forEach((postagem) => {
        if (postagem instanceof PostagemAvancada) {
          postagem.decrementarVisualizacoes(); // Decrementa visualizações aqui para todas as postagens avançadas
        }
      });
    
      const postagensExibiveis = postagens.filter((postagem) => {
        if (postagem instanceof PostagemAvancada) {
          return postagem.visualizacoesRestantes > 0;
        }
        return true;
      });
    
      return postagensExibiveis;
    }
  
    curtir(idPostagem: number): void {
      const postagem = this._repositorioDePostagens.consultar(idPostagem)[0];
      if (postagem) {
        postagem.curtir();
        console.log("Postagem curtida com sucesso.");
      } else {
        console.log("Erro: Postagem não encontrada.");
      }
    }
  
    descurtir(idPostagem: number): void {
      const postagem = this._repositorioDePostagens.consultar(idPostagem)[0];
      if (postagem) {
        postagem.descurtir();
        console.log("Postagem descurtida com sucesso.");
      } else {
        console.log("Erro: Postagem não encontrada.");
      }
    }
  
    decrementarVisualizacoes(postagem: PostagemAvancada): void {
      if (postagem instanceof PostagemAvancada) {
        postagem.decrementarVisualizacoes();
        if (postagem._visualizacoesRestantes < 0) {
          postagem._visualizacoesRestantes = 0;
        }
      }
    }
  
    exibirPostagensPorPerfil(id: number): Postagem[] {
      const perfil = this._repositorioDePerfis.consultar(id);
      if (!perfil) {
        console.log("Perfil não encontrado.");
        return [];
      }
    
      const postagens = perfil.postagens;
      
      const postagensExibiveis = postagens.filter((postagem) => {
        if (postagem instanceof PostagemAvancada) {
          if (postagem.visualizacoesRestantes > 0) {
            postagem.decrementarVisualizacoes(); // Decrementa visualizações aqui
            return true; // Retorna verdadeiro apenas se ainda houver visualizações restantes
          }
          return false;
        }
        return true;
      });
  
      return postagensExibiveis;
    }
    
    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
      const postagens = this._repositorioDePostagens.consultar(undefined, undefined, hashtag);
    
      postagens.forEach((postagem) => {
        if (postagem instanceof PostagemAvancada) {
          postagem.decrementarVisualizacoes();
        }
      });
    
      const postagensExibiveis = postagens.filter((postagem) => {
        if (postagem instanceof PostagemAvancada) {
          if (postagem.visualizacoesRestantes > 0) {
            return true;
          }
          return false;
        }
      });
    
      return postagensExibiveis as PostagemAvancada[];
    }
  
    exibirHashtagsPopulares(): string[] {
      const hashtags: { [hashtag: string]: { count: number, posts: number[] } } = {};
    
      for (const postagem of this._repositorioDePostagens.postagens) {
        if (postagem instanceof PostagemAvancada) {
          for (const hashtag of postagem.hashtags) {
            if (hashtags[hashtag]) {
              hashtags[hashtag].count++;
              if (!hashtags[hashtag].posts.includes(postagem.id)) {
                hashtags[hashtag].posts.push(postagem.id);
              }
            } else {
              hashtags[hashtag] = { count: 1, posts: [postagem.id] };
            }
          }
        }
      }
    
      const popularHashtags: string[] = [];
    
      for (const hashtag in hashtags) {
        if (hashtags[hashtag].count > 1) { // Só considerar hashtags presentes em mais de uma postagem
          popularHashtags.push(`Hashtag: ${hashtag}, Número de Postagens: ${hashtags[hashtag].count}`);
        }
      }
      return popularHashtags;
    }
    
    excluirPostagem(id: number): void {
      const postagens = this._repositorioDePostagens.consultar(id);
    
      if (postagens.length === 0) {
        console.log("Erro: Postagem não encontrada.");
        return;
      }
    
      const postagem = postagens[0];
    
      if (postagem.perfil) {
        const perfil = this._repositorioDePerfis.consultar(postagem.perfil.id);
    
        if (perfil) {
          const index = perfil.postagens.indexOf(postagem);
    
          if (index !== -1) {
            perfil.postagens.splice(index, 1);
          }
        }
      }
    
      const index = this._repositorioDePostagens.postagens.indexOf(postagem);
    
      if (index !== -1) {
        this._repositorioDePostagens.postagens.splice(index, 1);
      }
    
      console.log("Postagem excluída com sucesso.");
    }
    
    excluirPerfil(id: number): void {
      const perfil = this._repositorioDePerfis.consultar(id);
  
      if (!perfil) {
        console.log("Perfil não encontrado.");
        return;
      }
  
      // Remova todas as postagens associadas ao perfil
      perfil.postagens.forEach((postagem) => {
        this.excluirPostagem(postagem.id);
      });
  
      // Remova o perfil do repositório de perfis
      this._repositorioDePerfis.remover(id);
      console.log("Perfil excluído com sucesso.");
    }
  
    exibirTodasAsPostagens(): void {
      const postagens = this._repositorioDePostagens.exibirTodasAsPostagens();
      
      if (postagens.length > 0) {
        postagens.forEach((postagem) => {
          if (postagem instanceof PostagemAvancada && postagem.visualizacoesRestantes === 0) {
            // Não exibe postagens avançadas com visualizações esgotadas
            return;}
          console.log(`\n${postagem.data}`);
          console.log(`${postagem.perfil.nome}: ${postagem.texto}`);
          if (postagem instanceof PostagemAvancada) {
            console.log(`${postagem.hashtags}`);
            console.log(`Visualizações Restantes: ${postagem.visualizacoesRestantes}`);
            if (postagem.visualizacoesRestantes > 0) {
              postagem.decrementarVisualizacoes();
            }
          }
          console.log(`${postagem.curtidas} curtidas, ${postagem.descurtidas} descurtidas. ${postagem.ehPopular() ? 'Postagem Popular' : ''}`);
          if (postagem.comentarios.length > 0) {
            console.log(`Número de Comentários: ${postagem.comentarios.length}`);
            postagem.comentarios.forEach((comentario) => {
              console.log(` - ${comentario.perfil.nome}: ${comentario.texto}`);
            });
          }
        });
      } else {
        console.log("Nenhuma postagem encontrada.");
      }
    }
  
  }