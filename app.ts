const promptSync = require('prompt-sync')();
import { Postagem } from "./postagem";
import { PostagemAvancada } from "./postagemAvancada";
import {Perfil} from "./perfil"

import { RedeSocial } from "./redeSocial";
class App {
    private redeSocial: RedeSocial;
  
    constructor() {
      this.redeSocial = new RedeSocial();
    }
  
    exibirMenu(): void {
      while (true) {
        console.log(`
                                  IFPIGRAM
  
                              Escolha uma opção:
  
  1. Criar Perfil                                     8. Remover Perfil
  2. Criar Postagem                                   9. Excluir Postagem
  3. Criar Postagem Avançada                          10. Adicionar Comentário
  4. Consultar Perfil                                 11. Excluir Comentário
  5. Consultar Postagem e Curtir/Descurtir Postagem   12. Exibir Postagens Populares
  6. Exibir Postagens por Hashtag                     13. Exibir Hashtags Populares
  7. Exibir Postagens por Perfil                      14. Exibir o Feed Completo
  
                                  0. Sair
        `);
  
        const opcao = promptSync("Escolha uma opção: ");
  
        switch (opcao) {
          case '1':
            this.criarPerfil();
            break;
          case '2':
            this.criarPostagem();
            break;
          case '3':
            this.criarPostagemAvancada();
            break;
          case '4':
            this.consultarPerfil();
            break;
          case '5':
            this.consultarPostagens();
            break;
          case '6':
            this.exibirPostagensPorHashtag();
            break;
          case '7':
            this.exibirPostagensPorPerfil();
            break;
          case '8':
            this.excluirPerfil();
            break;
          case '9':
            this.excluirPostagem();
            break;
          case '10':
            this.adicionarComentario();
            break;
          case '11':
            this.excluirComentario();
            break;
          case '12':
            this.exibirPostagensPopulares();
            break;
          case '13':
            this.exibirHashtagsPopulares();
            break;
          case '14':
            this.exibirTodasAsPostagens();
            break;
          case '0':
            console.log("Saindo do IFPIGRAM");
            return;
          default:
            console.log("Opção inválida. Escolha uma opção válida.");
        }
      }
    }
  
      menuCurtirDescurtir(postagem: Postagem): void {
        while (true) {
          console.log(`
          Escolha uma opção:
          1. Curtir Postagem
          2. Descurtir Postagem
          0. Voltar
          `);
    
          const opcao = promptSync("Escolha uma opção: ");
    
          switch (opcao) {
            case '1':
              this.redeSocial.curtir(postagem.id);
              break;
            case '2':
              this.redeSocial.descurtir(postagem.id);
              break;
            case '0':
              return;
            default:
              console.log("Opção inválida. Escolha uma opção válida.");
          }
        }
      }
    
      criarPerfil(): void {
        const id = parseInt(promptSync("Digite o seu ID: "));
        const nome = promptSync("Digite seu nome: ");
        const email = promptSync("Digite seu email: ");
    
        const perfil = new Perfil(id, nome, email);
        this.redeSocial.incluirPerfil(perfil);
      }
    
      criarPostagem(): void {
        const perfilId = parseInt(promptSync("Digite o ID do perfil que está fazendo a postagem: "));
        const id = parseInt(promptSync("Digite o ID da postagem: "));
        const texto = promptSync("Digite o texto da postagem: ");
    
        const perfil = this.redeSocial.consultarPerfil(perfilId);
        if (!perfil) {
          console.log("Erro: Perfil inexistente.");
          
          return;
          
        }
        const postagem = new Postagem(id, texto, 0, 0, new Date(), perfil);
        this.redeSocial.incluirPostagem(postagem);
      }
  
      criarPostagemAvancada(): void {
        const perfilId = parseInt(promptSync("Digite o ID do perfil que está fazendo a postagem: "));
        const id = parseInt(promptSync("Digite o ID da postagem: "));
        const texto = promptSync("Digite o texto da postagem: ");
        const hashtagsInput = promptSync("Deseja adicionar hashtags a esta postagem? (1 para sim, 0 para não): ");
        let hashtags: string[] = [];
  
        if (hashtagsInput === "1") {
          const hashtagsString = promptSync("Digite as hashtags (separadas por vírgula): ");
          hashtags = hashtagsString.split(',');
        }
  
        const visualizacoesRestantes = parseInt(promptSync("Digite o número de visualizações para a sua postagem: "));
    
        const perfil = this.redeSocial.consultarPerfil(perfilId);
        if (perfil) {
          const postagemAvancada = new PostagemAvancada(id, texto, 0, 0, new Date(), perfil, hashtags, visualizacoesRestantes);
          this.redeSocial.incluirPostagem(postagemAvancada);
           
        } else {
          console.log("Perfil não encontrado. A postagem não pôde ser criada.");
        }
      }
    
      consultarPerfil(): void {
        const id = parseInt(promptSync("Digite o ID do perfil: "));
        const perfil = this.redeSocial.consultarPerfil(id);
        if (perfil) {
          console.log(`Perfil encontrado: ${perfil.nome}`);
          console.log(`Quantidade de postagens: ${perfil.postagens.length}`);
        } else {
          console.log("Perfil não encontrado.");
        }
      }
    
      consultarPostagens(): void {
        const id = parseInt(promptSync("Digite o ID da postagem: "));
        const postagens = this.redeSocial.consultarPostagens(id);
      
        if (postagens.length === 0) {
          console.log("Nenhuma postagem encontrada.");
          return;
        }
      
        postagens.forEach((postagem) => {
          console.log(`\n${postagem.data}`);
          console.log(`${postagem.perfil.nome}: ${postagem.texto}`);
          if (postagem instanceof PostagemAvancada) {
            console.log(`${postagem.hashtags}`);
            console.log(`Visualizações Restantes: ${postagem.visualizacoesRestantes}`);
          }
          console.log(`${postagem.curtidas} curtidas, ${postagem.descurtidas} descurtidas. ${postagem.ehPopular() ? 'Postagem Popular' : ''}`);
          if (postagem.comentarios.length > 0) {
            console.log(`Número de Comentários: ${postagem.comentarios.length}`);
            postagem.comentarios.forEach((comentario) => {
              console.log(` - ${comentario.perfil.nome}: ${comentario.texto}`);
            });
          }        
        });
  
        if (id) {
          const postagemSelecionada = postagens.find((postagem) => postagem.id === Number(id));
          if (postagemSelecionada) {
            this.menuCurtirDescurtir(postagemSelecionada);
          } else {
            console.log("Postagem não encontrada.");
          }
        }
      }
        
        exibirPostagensPorPerfil(): void {
          const idPerfil = parseInt(promptSync("Digite o ID do perfil: "));
          const postagens = this.redeSocial.exibirPostagensPorPerfil(idPerfil);
  
          if (postagens.length > 0) {
            postagens.forEach((postagem) => {
            console.log(`\n${postagem.data}`);
            console.log(`${postagem.perfil.nome}: ${postagem.texto}`);
            if (postagem instanceof PostagemAvancada) {
              console.log(`${postagem.hashtags}`);
              console.log(`Visualizações Restantes: ${postagem.visualizacoesRestantes}`);
            }
            console.log(`${postagem.curtidas} curtidas, ${postagem.descurtidas} descurtidas. ${postagem.ehPopular() ? 'Postagem Popular!' : ''}`);
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
    
      exibirPostagensPorHashtag(): void {
        const hashtag = promptSync("Digite a hashtag: ");
        const postagens = this.redeSocial.exibirPostagensPorHashtag(hashtag);
  
        if (postagens.length > 0) {
          
          console.log(`Postagens com a hashtag: ${hashtag}`);
          postagens.forEach((postagem) => {
            console.log(`\n${postagem.data}`);
            console.log(`${postagem.perfil.nome}: ${postagem.texto}`);
            if (postagem instanceof PostagemAvancada) {
              console.log(`Visualizações Restantes: ${postagem.visualizacoesRestantes}`);
            }
            console.log(`${postagem.curtidas} curtidas, ${postagem.descurtidas} descurtidas. ${postagem.ehPopular() ? 'Postagem Popular!' : ''}`);
            if (postagem.comentarios.length > 0) {
              console.log(`Número de Comentários: ${postagem.comentarios.length}`);
              postagem.comentarios.forEach((comentario) => {
                console.log(` - ${comentario.perfil.nome}: ${comentario.texto}`);
              });
            }
          });
        } else {
          console.log("Nenhuma postagem encontrada com esta hashtag.");
        }
      }
  
      exibirPostagensPopulares(): void {
        const postagens = this.redeSocial.consultarPostagens();
      
        if (postagens.length > 0) {
          const postagensPopulares = postagens.filter((postagem) => {
            return postagem.ehPopular() && ((postagem instanceof PostagemAvancada && postagem.visualizacoesRestantes > 0) || postagem instanceof Postagem);
          });
      
          if (postagensPopulares.length > 0) {
            console.log("Postagens Populares:");
            postagensPopulares.forEach((postagem) => {
              console.log(`\n${postagem.data}`);
              console.log(`${postagem.perfil.nome}: ${postagem.texto}`);
              if (postagem instanceof PostagemAvancada) {
                console.log(`Visualizações Restantes: ${postagem.visualizacoesRestantes}`);
              }
              console.log(`${postagem.curtidas} curtidas, ${postagem.descurtidas} descurtidas`);
              if (postagem.comentarios.length > 0) {
                console.log(`Número de Comentários: ${postagem.comentarios.length}`);
                postagem.comentarios.forEach((comentario) => {
                  console.log(` - ${comentario.perfil.nome}: ${comentario.texto}`);
                });
              }
            });
          } else {
            console.log("Nenhuma postagem popular encontrada que ainda possa ser exibida.");
          }
        } else {
          console.log("Nenhuma postagem encontrada.");
        }
      }
  
      exibirHashtagsPopulares(): void {
        const popularHashtags = this.redeSocial.exibirHashtagsPopulares();
      
        if (popularHashtags.length > 0) {
          console.log("Hashtags Populares:");
          popularHashtags.forEach((hashtagInfo) => {
            console.log(hashtagInfo);
          });
        } else {
          console.log("Nenhuma hashtag popular encontrada.");
        }
      }
  
      adicionarComentario(): void {
        const idPostagem = parseInt(promptSync("Digite o ID da postagem que deseja comentar: "));
        
        const postagem = this.redeSocial.consultarPostagens(idPostagem);
      
        if (postagem.length === 0) {
          console.log("Postagem não encontrada.");
          return;
        }
      
        const perfilId = parseInt(promptSync("Digite o ID do perfil que está comentando: "));
        const perfil = this.redeSocial.consultarPerfil(perfilId);
        
        if (!perfil) {
          console.log("Perfil não encontrado.");
          return;
        }
        const textoComentario = promptSync("Digite o texto do comentário: ");
      
        postagem[0].adicionarComentario(postagem[0].comentarios.length + 1, textoComentario, perfil);
      
        console.log("Comentário adicionado com sucesso.");
      }
  
      excluirPostagem(): void {
        const idPostagem = parseInt(promptSync("Digite o ID da postagem que deseja excluir: "));
      
        this.redeSocial.excluirPostagem(idPostagem);
      }
  
      excluirComentario(): void {
        const idPostagem = parseInt(promptSync("Digite o ID da postagem da qual deseja excluir um comentário: "));
        const postagem = this.redeSocial.consultarPostagens(idPostagem);
      
        if (postagem.length === 0) {
          console.log("Postagem não encontrada.");
          return;
        }
      
        if (postagem[0].comentarios.length === 0) {
          console.log("Não há comentários para excluir.");
          return;
        }
      
        console.log("Comentários da postagem:");
        postagem[0].comentarios.forEach((comentario) => {
          console.log(`ID: ${comentario.id}, Texto: ${comentario.texto}`);
        });
      
        const idComentario = parseInt(promptSync("Digite o ID do comentário que deseja excluir: "));
      
        postagem[0].excluirComentario(idComentario);
      }
  
      excluirPerfil(): void {
        const idPerfil = parseInt(promptSync("Digite o ID do perfil que deseja excluir: "));
        this.redeSocial.excluirPerfil(idPerfil);
      }
  
      exibirTodasAsPostagens(): void {
        this.redeSocial.exibirTodasAsPostagens();
      }
  
    }
  
  const app = new App();
  app.exibirMenu();