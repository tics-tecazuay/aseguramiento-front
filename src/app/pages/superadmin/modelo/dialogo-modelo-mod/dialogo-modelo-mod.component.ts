import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogoCriterioComponent } from '../dialogo-criterio/dialogo-criterio.component';
import { ModeloService } from 'src/app/services/modelo.service';
import Swal from 'sweetalert2';
import { Modelo } from 'src/app/models/Modelo';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { Indicador } from 'src/app/models/Indicador';
import { LoginService } from 'src/app/services/login.service';
import { AsignacionIndicador } from 'src/app/models/AsignacionIndicador';
import { DialogoSubcriterioComponent } from '../dialogo-subcriterio/dialogo-subcriterio.component';
import { Asignacion_Criterios } from 'src/app/models/Asignacion-Criterios';
import { AsignacionCriterioService } from 'src/app/services/asignacion-criterio.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { ModelIndiProjection } from 'src/app/interface/ModelIndiProjection';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { catchError } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

let VALOR: any[] = [];


@Component({
  selector: 'app-dialogo-modelo-mod',
  templateUrl: './dialogo-modelo-mod.component.html',
  styleUrls: ['./dialogo-modelo-mod.component.css']
})
export class DialogoModeloModComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  selectedIndicators: number[] = [];
  dataSource1: any[] = []; // Ajusta el tipo de dato según tu estructura
  selectedSubcriterios: any[] = []; // Almacena los subcriterios seleccionados

  dataSource2: any[] = [];
  modelo: Modelo = new Modelo();
  indicador: Indicador = new Indicador();
  asignacionIndicador: AsignacionIndicador = new AsignacionIndicador();
  columnas: string[] = ['criterio', 'subcriterio', 'id', 'indicador','visi'];
  spanningColumns = ['criterio', 'subcriterio'];
  spans: any[] = [];
  indi_model:ModelIndiProjection[] = [];
  itemsPerPageLabel = 'Indicadores por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  selectedIds: number[] = [];
  id_mode!: number;
  mensaje:string='';
  vertabla= false;
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
  constructor(public login: LoginService, private asignacionIndicadorService: AsignacionIndicadorService, private dialogRef: MatDialogRef<DialogoModeloModComponent>, private _formBuilder: FormBuilder, private dialog: MatDialog, private router: Router, private modelo_service: ModeloService, private sharedDataService: SharedDataService,
    private asignacionAdminService: AsignacionCriterioService,private criterioService:CriteriosService,
    private subcriterioService:SubcriteriosService, private formBuilder: FormBuilder,
    private indicadorService: IndicadoresService,private paginatorIntl: MatPaginatorIntl,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.paginatorIntl.nextPageLabel = this.nextPageLabel;
      this.paginatorIntl.lastPageLabel = this.lastPageLabel;
      this.paginatorIntl.firstPageLabel=this.firstPageLabel;
      this.paginatorIntl.previousPageLabel=this.previousPageLabel;
      this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
      this.paginatorIntl.getRangeLabel=this.rango;
  }

  
  ngOnInit(): void {
    this.criterioService.getDatos().subscribe(criterios => {
      // console.log("Criterios Unidos "+JSON.stringify(criterios));
    });
    this.modelo = this.data.item;
    this.id_mode=this.data.item.id_modelo;
    // console.log("modelo traido mod "+this.id_mode)
    
    // this.sharedDataService.datos$.subscribe(data => {
    //   this.dataSource = VALOR;
    //   this.dataSource = data;
    // });
    
    this.modelo_service.getlistmodelindi(this.id_mode).subscribe(data => {
      this.dataSource2 = data.map(item => {
        return {
          crite: item.crite,
          sub: item.sub,
          id_indi: item.id_indi,
          ind_nombre: item.ind_nombre,
          checked: item.visi
        };
      });
      this.cacheSpan('criterio', (d) => d.crite);
      this.cacheSpan('subcriterio', (d) => d.crite + d.sub);
      setTimeout(() => {
        this.aplicar();
      }, 0);

    });

    this.listarIndicadores();
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    );
  }

  mostrarTabla() {
    this.vertabla = true;
  }
  aplicar() {
    this.dataSource2.forEach(element => {
      element.randomColor = this.generarColor();
    });
    this.dataSource2.forEach(element => {
      element.Colores = this.generarColor2();
    });
  }

  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource2.length;) {
      let currentValue = accessor(this.dataSource2[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource2.length; j++) {
        if (currentValue !== accessor(this.dataSource2[j])) {
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

  getSelectedIds() {
    const selectedIds: number[] = [];
    this.dataSource2.forEach(element => {
      if (element.checked) {
        selectedIds.push(element.id_indi);
      }
    });
    return selectedIds;
  }
  
  generarColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  generarColor2(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  
  listarIndicadores(): void {
    // console.log(this.modelo.id_modelo)
    this.indicadorService.getIndicadorPorModelo(this.modelo.id_modelo).subscribe(
      (data: Indicador[]) => {
        // console.log(data)
        this.dataSource = data;
      },
      (error: any) => {
        console.error('Error al listar los criterios:', error);
      }
    );
  }

  onCheckboxChange(event: MatCheckboxChange, element: any) {
    element.checked = event.checked; // Actualiza el valor de checked en el objeto
  }
  
  //metodo para crear un modelo
  public modificarModelo(): void {
    if (this.modelo.fecha_inicio == null || this.modelo.fecha_fin == null || this.modelo.fecha_final_act == null || this.modelo.nombre == null) {
      Swal.fire('Error', `Debe llenar todos los campos`, 'error');
      return;
    }
  
    if (this.modelo.fecha_inicio >= this.modelo.fecha_fin || this.modelo.fecha_inicio >= this.modelo.fecha_final_act || this.modelo.fecha_fin <= this.modelo.fecha_final_act) {
      Swal.fire('Error', `Las fechas no son correctas por favor revisar`, 'error');
      return;
    }
  
    Swal.fire({
      title: '¿Estás seguro de modificar el modelo?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Modificar`,
    }).then(async (result) => {
      if (!result.isConfirmed) {
        try {
          await this.modelo_service.modificar(this.modelo).toPromise();
          await this.eliminarYGuardarAsignaciones();
          this.dialogRef.close();
          Swal.fire('Modificado con exito! '+this.mensaje, '', 'success');
        } catch (error: any) {
          if (error.status === 400) {
            Swal.fire('Error', 'El modelo actual no puede tener las mismas fechas del modelo anterior.', 'error');
          } else {
          console.error('Error al modificar el registro:', error);

          Swal.fire('Error', 'No se pudo modificar el modelo.', 'error');}
        }
      }
    });
  }
  
  async eliminarYGuardarAsignaciones() {
    if (this.vertabla) {
      try {
      const asignacionesEnBase = await this.modelo_service?.getlistmodelindi(this.id_mode).toPromise();
      const idsEnBase = asignacionesEnBase?.map((asig => asig.id_indi));
      // Encontrar IDs que se deben eliminar
      const idsAEliminar = idsEnBase?.filter((id: number) => !this.getSelectedIds().includes(id));

      // Eliminar las asignaciones que ya no están presentes
      if (idsAEliminar) {
        for (const idAEliminar of idsAEliminar) {
          try {
            const response = await this.asignacionIndicadorService.getEliminaasig(this.id_mode, idAEliminar).toPromise();
          
          } catch (error) {
            console.error('Error al eliminar asignación:', error);
            if (error instanceof HttpErrorResponse) {
              this.mensaje=(error.error+" ").toString();
              // console.log('Mensaje del backend:', error.error); 
              
            }
          }
        }
      }
      
        //
        const selectedIds = this.getSelectedIds();
        const observables = selectedIds.map(id => {
          const asignacionIndicador = new AsignacionIndicador();
          asignacionIndicador.indicador = {
            id_indicador:id,
            nombre:'',
            descripcion:'',
            peso:0,
            tipo:"",
            estandar:0,
            valor_obtenido:0,
            porc_obtenido:0,
            porc_utilida_obtenida:0,
            subcriterio:null, visible:true
          };
          asignacionIndicador.modelo= {
            id_modelo: this.id_mode,
            fecha_fin:new Date,
            fecha_final_act:new Date,
            fecha_inicio:new Date,
            nombre:'',
            visible:true,
            usuario:null
          };
          // console.log('Asignaciones indicadores:',  asignacionIndicador.indicador.id_indicador+"id "+id);
          // console.log('Asignaciones modelo:',  asignacionIndicador.modelo.id_modelo+"id modelo "+this.modelo.id_modelo);
          return this.asignacionIndicadorService.createAsignacionIndicador(asignacionIndicador);
        });
  
        await forkJoin(observables).toPromise();
  
        console.log('Asignaciones creadas para los IDs:', selectedIds);
      } catch (error) {
        console.error('Error en eliminación o guardado de asignaciones:', error);
        throw new Error('Ocurrió un error en la eliminación o guardado de asignaciones.');
      }
    }
  }

 
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  displayedColumns: string[] = ['nombre'];
  dataSource: any;

  abrirDialogo(): void {

    const dialogRef = this.dialog.open(DialogoCriterioComponent, {
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.dataSource = VALOR;
      // console.log('El diálogo se cerró');
    });

  }

  addSubcriterio(): void {
    const dialogRef = this.dialog.open(DialogoSubcriterioComponent, {
      width: '50%',
      data: { /* datos que se pasan al diálogo */ }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('El diálogo se cerró');
    });
  }


  reiniciarAdmin() {
    this.asignacionAdminService.listarAsignarResponsable().subscribe(data => {
      data.forEach((element: any) => {
        this.asignacionAdminService.deleteAsignacion_Admin(element.id_asignacion).subscribe(data => {
          // console.log(data);
        });
      });
    })
  }

  reiniciarIndicador() {
    this.indicadorService.getIndicadores().subscribe(data => {
      data.forEach((element: any) => {
        element.valor_obtenido = 0;
        element.porc_obtenido = 0;
        element.porc_utilida_obtenida = 0;
        this.indicadorService.ponderarIndicador(element.id_indicador, element).subscribe(data => {
          // console.log(data);
        });
      });
    })
  }

}
