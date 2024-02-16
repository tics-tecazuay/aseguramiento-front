import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuantitativa } from 'src/app/models/Cuantitativa';
import { Formulas } from 'src/app/models/Formulas';
import { FormulaService } from 'src/app/services/formula.service';

@Component({
  selector: 'app-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.css']
})
export class FormulasComponent implements OnInit {

  itemsPerPageLabel = 'Fórmulas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  ocultar=false;
  
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
  
  miModal!: ElementRef;
  public formu = new Formulas();
  listaFromulas: Formulas[] = [];
  frmFormula: FormGroup;
  guardadoExitoso: boolean = false;

  filterPost = '';
  dataSource = new MatTableDataSource<Formulas>();
  columnasUsuario: string[] = ['id_formula', 'descripcion','formula', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private service: FormulaService,private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.frmFormula = fb.group({
      descripcion: ['', Validators.required],
      formula: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.listar();
  }

  guardar() {
    this.formu = this.frmFormula.value;
    console.log(this.formu)
    this.service.crear(this.formu).
      subscribe(
        (reponse) => {
          console.log('Formula creada con éxito:', reponse);
          this.guardadoExitoso = true;
          this.listar();

        },
        (error) => {
          console.error('Error al crear la formula:', error);
        }
      )
  }

  eliminar(formula: Formulas) {
    console.log(formula);
    this.service.eliminar(formula).
      subscribe((reponse) => {
        this.listar();
      },
        (error: any) => {
          console.error('Error al listar los criterios al eliminar:', error);
        })
  }


  listar(): void {
    this.service.getFormulas().
      subscribe(
        (data: any) => {
          this.listaFromulas = data;
          this.dataSource.data=this.listaFromulas;
        },
        (error: any) => {
          console.error('Error al listar las formula', error);
        }
      )
  }

  editDatos(formulaN: Formulas) {
    this.formu = formulaN;
    this.frmFormula = new FormGroup({
      descripcion: new FormControl(formulaN.descripcion),
      formula: new FormControl(formulaN.formula)
    });
  }

  limpiarFormulario() {
    this.frmFormula.reset();
    this.formu = new Formulas;
  }

  actualizar() {
    this.formu.descripcion = this.frmFormula.value.descripcion;
    this.formu.formula = this.frmFormula.value.formula;
    this.service.actualizar(this.formu.id_formula, this.formu)
      .subscribe(response => {
        this.formu = new Formulas();
        this.listar();
      });
  }

  //TS PARA CUANTITATIVA

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
}



