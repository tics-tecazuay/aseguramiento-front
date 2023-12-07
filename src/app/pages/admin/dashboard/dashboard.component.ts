import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AsignacionProjection } from 'src/app/interface/AsignacionProjection';
import { Modelo } from 'src/app/models/Modelo';
import { AsignacionResponsableService } from 'src/app/services/asignacion-responsable.service';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  asig!:AsignacionProjection[];
  asig2!:AsignacionProjection[];
  model!:Modelo[];
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  showHint!: boolean;
  //
  nombremodelo: string = '';
  displayedColumns: string[] = ['enc', 'nombrescri','actividasi'];
  displayedColumns2: string[] = ['enc', 'nombrescri','actividasi'];
  spanningColumns = ['enc', 'nombrescri'];
  displayedModel: string[] = ['id_modelo', 'nombre','fecha_inicio','fecha_fin'];
  spans: any[] = [];
  spans2: any[] = [];
  itemsPerPageLabel = 'Items por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  rango:any= (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }
  
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
  constructor(private router:Router,private service:AsignacionResponsableService,
    private paginatorIntl: MatPaginatorIntl,private servmodel:ModeloService) {
      }

  ngOnInit(): void {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
    this.listarmodelo();
  }

  //Contador para combinar celdas
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.asig.length;) {
      let currentValue = accessor(this.asig[i]);
      let count = 1;

      for (let j = i + 1; j < this.asig.length; j++) {
        if (currentValue !== accessor(this.asig[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
  
      this.spans[i][key] = count;
      i += count;
    }
  }
  
  
  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
//
cacheSpan2(key: string, accessor: (d: any) => any) {
  for (let i = 0; i < this.asig2.length;) {
    let currentValue = accessor(this.asig2[i]);
    let count = 1;

    for (let j = i + 1; j < this.asig2.length; j++) {
      if (currentValue !== accessor(this.asig2[j])) {
        break;
      }
      count++;
    }

    if (!this.spans2[i]) {
      this.spans2[i] = {};
    }

    this.spans2[i][key] = count;
    i += count;
  }
}


getRowSpan2(col: any, index: any) {
  return this.spans2[index] && this.spans2[index][col];
}
//
  listarmodelo() {
    this.servmodel.listarModelo().subscribe(
      (data: any) => {
        console.log(data);
        this.model = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  //
  cargarTabla(idModelo: number) {
    this.nombremodelo= this.model.find(m => m.id_modelo === idModelo)?.nombre || '';
    console.log('Cargando tabla para el id_modelo:', idModelo);
    this.service.asignaradmin(idModelo,'true').subscribe((data:AsignacionProjection[])=>{
      this.asig=data;
      console.log("actividades ", JSON.stringify(this.asig))
      this.cacheSpan('enc', (d) => d.enc);
      this.cacheSpan('nombrescri', (d) => d.enc + d.nombrescri);
    });

    this.service.asignaradmin(idModelo,'false').subscribe((data:AsignacionProjection[])=>{
      this.asig2=data;
      console.log("actividades ", JSON.stringify(this.asig2))
      this.cacheSpan2('enc', (d) => d.enc);
      this.cacheSpan2('nombrescri', (d) => d.enc + d.nombrescri);
    });
  }
 
}
