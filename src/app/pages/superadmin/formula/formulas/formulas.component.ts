import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Formulas, FormulasProjection } from 'src/app/models/Formulas';
import { Modelo } from 'src/app/models/Modelo';
import { FormulaService } from 'src/app/services/formula.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.css']
})
export class FormulasComponent implements OnInit {

  itemsPerPageLabel = 'Fórmulas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  ocultar = false;
  mostrarColumnas = false;

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


  listaFromulas: FormulasProjection[] = [];

  filterPost = '';
  dataSource = new MatTableDataSource<FormulasProjection>();
  columnasUsuario: string[] = ['id_formula', 'criterio', 'subcriterio', 'indicador', 'formula', 'descripcion', 'actions'];
  modeloVigente!: Modelo;
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private service: FormulaService, private paginatorIntl: MatPaginatorIntl,

  ) {

    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.obtenerModeloVigente();
    this.listar();
  }

  obtenerModeloVigente() {
  this.modeloVigente=JSON.parse(localStorage.getItem('modelo') || '{}');
  }

  eliminar(formula: Formulas) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(formula);
        this.service.eliminar(formula).
          subscribe((reponse) => {
            this.listar();
            Swal.fire('¡Eliminado!', 'La fórmula ha sido eliminada', 'success');
          },
            (error: any) => {
              console.error('Error ocurrió un error al eliminar la fórmula:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar la fórmula', 'error');
            }
          );
      }
    });

  }


  listar(): void {
    this.service.getFormulas(this.modeloVigente.id_modelo).
      subscribe(
        (data: any) => {
          this.listaFromulas = data;
          this.dataSource.data = this.listaFromulas;
        },
        (error: any) => {
          console.error('Error al listar las formula', error);
        }
      )
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.listaFromulas;;
    }
  }

  toggleColumnVisibility() {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

}



