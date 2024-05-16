import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarUsuario'
})
export class BuscarUsuarioPipe implements PipeTransform {

  transform(items: any[] | undefined, searchText: string | undefined): any[] | undefined {
    if (!items || !searchText) {
      return items;
    }
    const lowerSearchText = searchText.toLowerCase();
    return items.filter(item => {
      // Verifica que la propiedad "criterionomj" esté presente en el objeto
      const criterionomj = item?.criterionomj?.toLowerCase();
      return criterionomj ? criterionomj.includes(lowerSearchText) : false;
    });
  }

}
