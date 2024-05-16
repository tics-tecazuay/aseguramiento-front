import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { Component, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Actividades } from 'src/app/models/actividades';
import { usuario } from 'src/app/models/Usuario';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ActividadesUsuarioProjection } from 'src/app/interface/ActividadesProjection';
import { Modelo } from 'src/app/models/Modelo';
@Component({
  selector: 'app-actividad-autoridad',
  templateUrl: './actividad-autoridad.component.html',
  styleUrls: ['./actividad-autoridad.component.css']
})
export class ActividadAutoridadComponent {
  actividad!: ActividadesUsuarioProjection[];
  constructor(private serEvide: EvidenciaService, private serviceactividad: ActividadService, private services: ActividadService,
    private paginatorIntl: MatPaginatorIntl, private router: Router,
    private fb: FormBuilder) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }
  itemsPerPageLabel = 'Items por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';

  rango: any = (page: number, pageSize: number, length: number) => {
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
  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  searchTerm: string = '';
  public actividades: Asigna_Evi[] = [];
  responsable: usuario[] = [];
  public actividad2 = new Asigna_Evi();
  filteredActividades: usuario[] | undefined;
  dataSource = new MatTableDataSource<any>(this.responsable);
  dataSource2 = new MatTableDataSource<ActividadesUsuarioProjection>();
  displayedColumns: string[] = ['Usuario', 'Nombre', 'Apellido', 'Correo', 'Actividades'];
  displayedColumns2: string[] = ['Nombre', 'Fecha Inicio', 'Fecha Fin'];
  modeloVigente!: Modelo;

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    //this.get();
    this.getResponsables();
    this.modeloVigente= JSON.parse(localStorage.getItem('modelo')|| '{}');
  }

  get() {
    this.services.get(this.modeloVigente.id_modelo).subscribe((ActividadesCalendar) => {
      this.actividades = this.actividades;

      this.filterEvidencias(); // <-- Actualización aquí
    });
  }

  getResponsables() {
    this.serEvide.listarsolorespon().subscribe(
      data => {
        this.responsable = data;
        this.dataSource.data = this.responsable;
        this.filterEvidencias();
        console.log(this.responsable);
      }
    )
  }

  Listaractividades(id: number) {
    this.serviceactividad.getActividadUsuario(id, this.modeloVigente.id_modelo).subscribe((data: ActividadesUsuarioProjection[]) => {
      this.actividad = data;
      this.dataSource2.data = this.actividad;
      console.log("actividad.. " + JSON.stringify(this.actividad))

    }
    );
  }

  filterEvidencias() {
    this.filteredActividades = this.responsable.filter(
      (actividad) =>
        actividad.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        actividad.persona.primer_nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filterPost = '';

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {

      // Restaurar los datos originales si no hay filtro aplicado
      this.getResponsables();
    }
  }

}
