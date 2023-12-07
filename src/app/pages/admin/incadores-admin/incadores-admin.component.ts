import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IndicadorEvidenciasProjectionFull } from 'src/app/interface/IndicadorEvidenciasProjectionFull';
import { Indicador } from 'src/app/models/Indicador';
import { IndicadoresService } from 'src/app/services/indicadores.service';
@Component({
  selector: 'app-incadores-admin',
  templateUrl: './incadores-admin.component.html',
  styleUrls: ['./incadores-admin.component.css']
})
export class IncadoresAdminComponent {
  miModal!: ElementRef;
  public indic = new Indicador();
  indicadors: any[] = [];

  filterPost = ''; 
  dataSource = new MatTableDataSource<IndicadorEvidenciasProjectionFull>();

  columnasUsuario: string[] = ['nombreSubcriterio', 'id_indicador', 'nombre', 'descripcion','peso', 'estandar', 'tipo', 'cantidadEvidencia'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(private indicadorservice: IndicadoresService,
  ) {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.listar()
  }



  listar(): void {
    this.indicadorservice.obtenerDatosIndicadoresFull().subscribe(
      (data: any[]) => {
        this.indicadors = data;
        this.dataSource.data=this.indicadors;
      },
      (error: any) => {
        console.error('Error al listar los indicadors:', error);
      }
    );
  }
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.indicadors;;
    }
  }
}
