import {Perfil} from "./perfil"
export class RepositorioDePerfis {
    private _perfis: Perfil[] = [];
    
    incluir(perfil: Perfil): void {
      this._perfis.push(perfil);
    }
  
    consultar(id?: number, nome?: string, email?: string): Perfil | null {
      const perfil = this._perfis.find(
        (p) =>
          (id !== undefined && p.id === id) ||
          (nome !== undefined && p.nome === nome) ||
          (email !== undefined && p.email === email)
      );
      return perfil || null;
    }
  
    remover(id: number): void {
      const index = this._perfis.findIndex((perfil) => perfil.id === id);
      if (index !== -1) {
        this._perfis.splice(index, 1);
      }
    }
  
  }