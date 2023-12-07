import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarEvidenciasPorID'
})
export class FiltrarEvidenciasPorIDPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(!value) return null;
    if(!args) return value;
    args=args.toLowerCase();
    return value.filter((item:any)=>{
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}