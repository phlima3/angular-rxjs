import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subscription,
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import { Item, Livro, LivrosResultado } from 'src/app/models/interface';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro: string = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    catchError((error) =>
      throwError(
        () => (this.mensagemErro = 'Ocorreu um erro ao buscar os livros.')
      )
    )
  );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((error) =>
      throwError(
        () => (this.mensagemErro = 'Ocorreu um erro ao buscar os livros.')
      )
    )
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => new LivroVolumeInfo(item));
  }
}
