import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubcriterioIndicadoresProjectionFull } from 'src/app/interface/SubcriterioIndicadoresProjectionFull';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
@Component({
  selector: 'app-subcriterios',
  templateUrl: './subcriterios.component.html',
  styleUrls: ['./subcriterios.component.css']
})
export class SubcriteriosComponent implements OnInit {

 
  miModal!: ElementRef;
  public subcrite = new Subcriterio();
  subcriterios: any[] = [];

  filterPost = '';
  dataSource = new MatTableDataSource<SubcriterioIndicadoresProjectionFull>();
  columnasUsuario: string[] = ['nombreCriterio', 'id_subcriterio', 'nombre', 'descripcion', 'cantidadIndicadores'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private subcriterioservice: SubcriteriosService,
  ) {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.listar()
  }

  
  
  listar(): void {
    this.subcriterioservice.obtenerDatosSubcriteriosFull().subscribe(
      (data: any[]) => {
        this.subcriterios = data;
        this.dataSource.data = this.subcriterios;
      },
      (error: any) => {
        console.error('Error al listar los subcriterios:', error);
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
      this.dataSource.data = this.subcriterios;;
    }
  }
}
