import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarUsuario'
})
export class BuscarUsuarioPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      // Realiza aquí la lógica de filtrado según tus necesidades
      // En este ejemplo, se busca en la propiedad "nombre" del objeto
      return item?.criterionomj.toLowerCase().includes(searchText)    });
  }

}
