import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { AsignacionCriterioService } from 'src/app/services/asignacion-criterio.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { forkJoin } from 'rxjs';

let VALOR: any[] = [];


@Component({
  selector: 'app-dialogo-modelo',
  templateUrl: './dialogo-modelo.component.html',
  styleUrls: ['./dialogo-modelo.component.css']
})
export class DialogoModeloComponent implements OnInit {
  copiando: boolean = false;
  isLoggedIn = false;
  user: any;
  isIdmaxSet = false;
  idmax!:number;
  modelo: Modelo = new Modelo();
  modeloVigente!: Modelo;
  indicador: Indicador = new Indicador();
  asignacionIndicador: AsignacionIndicador = new AsignacionIndicador();
  listaIndicadores: Indicador[] = [];

  constructor(public login: LoginService, 
    private asignacionIndicadorService: AsignacionIndicadorService, 
    private dialogRef: MatDialogRef<DialogoModeloComponent>, 
    private _formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private modelo_service: ModeloService, 
    private sharedDataService: SharedDataService,) {}

  ngOnInit(): void {
    this.sharedDataService.datos$.subscribe(data => {
      this.dataSource = VALOR;
      this.dataSource = data;
      console.log(this.dataSource);
    });
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    );
    console.log(this.user);
    this.modeloVigente = JSON.parse(localStorage.getItem("modelo") || '{}');
    this.idmax = this.modeloVigente.id_modelo;
  }
  
  //metodo para crear un modelo
  public createModelo(): void {
    if (this.modelo.fecha_inicio == null || this.modelo.fecha_fin == null || this.modelo.fecha_final_act == null || this.modelo.nombre == null || this.dataSource.length == 0) {
      Swal.fire('Error', `Debe llenar todos los campos`, 'error');
      return;
    }

    if (this.modelo.fecha_inicio >= this.modelo.fecha_fin || this.modelo.fecha_inicio >= this.modelo.fecha_final_act || this.modelo.fecha_fin <= this.modelo.fecha_final_act) {
      Swal.fire('Error', `Las fechas no son correctas porfavor revisar`, 'error');
      return;
    }
    this.modelo_service.createModelo(this.modelo).subscribe(
      response => {
        console.log(response);
        this.dataSource.forEach((element: any) => {
          this.asignacionIndicador.indicador = element;
          this.asignacionIndicador.modelo = response;
          this.asignacionIndicadorService.createAsignacionIndicador(this.asignacionIndicador).subscribe(
            (result) => {
              console.log(result);
              this.sharedDataService.agregarDatos([]);
              localStorage.removeItem("modelo");
              this.modelo_service.getModeMaximo().subscribe((data: any) => {
              this.modeloVigente = data;
              localStorage.setItem("modelo", JSON.stringify(this.modeloVigente));
            });
              this.dialogRef.close();
            }
          )
        });
      
      },
      (error) => {
        if (error.status === 400) {
          Swal.fire('Error', 'El modelo actual no puede tener las mismas fechas del modelo anterior.', 'error');
        } else {
          // Manejo de otros errores
          Swal.fire('Error', 'Hay problemas con el servidor.', 'error');
        }
    }
    )
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
      console.log('El diálogo se cerró');
    });
  }

  copiarModelo() {
    if (this.modelo.fecha_inicio == null || this.modelo.fecha_fin == null || this.modelo.fecha_final_act == null || this.modelo.nombre == null) {
      Swal.fire('Advertencia', 'Completa las nuevas fechas y el nombre antes de copiar el modelo vigente.', 'warning');
      return;
    }

    this.copiando = true;
    this.secondFormGroup.get('secondCtrl')?.clearValidators();
    this.secondFormGroup.get('secondCtrl')?.updateValueAndValidity();
    console.log("id copiado "+this.idmax);
  
    if (this.modelo.fecha_inicio >= this.modelo.fecha_fin || this.modelo.fecha_inicio >= this.modelo.fecha_final_act || this.modelo.fecha_fin <= this.modelo.fecha_final_act) {
      Swal.fire('Error', `Las fechas no son correctas por favor revisar`, 'error');
      return;
    }
    console.log("MODELO COPIADO ",this.modelo);
    this.modelo_service.createModelo(this.modelo).subscribe(
      nuevoModelo => {
        console.log("Guardado datos del nuevo modelo: " + JSON.stringify(nuevoModelo));
  
        this.asignacionIndicadorService.getasignaindi(this.idmax).subscribe(
          asignaciones => {
            console.log('Asignaciones de indicadores del último modelo:', JSON.stringify(asignaciones));
  
            const asignacionObservables = asignaciones.map(asignacion => {
              const nuevaAsignacion: AsignacionIndicador = {
                id_asignacion_indicador: 0,
                modelo: nuevoModelo,
                indicador: asignacion.indicador,
              };
              return this.asignacionIndicadorService.createAsignacionIndicador(nuevaAsignacion);
            });
  
            forkJoin(asignacionObservables).subscribe(
              resultados => {
                console.log("Todas las asignaciones creadas:", resultados);
                this.copiando = false;
                localStorage.removeItem("modelo");
                this.modelo_service.getModeMaximo().subscribe((data: any) => {
                this.modeloVigente = data;
                localStorage.setItem("modelo", JSON.stringify(this.modeloVigente));
              });
                this.dialogRef.close();
                Swal.fire('Éxito', 'El modelo se ha copiado correctamente', 'success');
              },
              error => {
                console.error('Error al crear las asignaciones:', error);
                this.copiando = false;
              }
            );
          },
          error => {
            console.error('Error al obtener asignaciones de indicadores:', error);
            this.copiando = false;
          }
        );
      },
      error => {
        console.error("Error al crear el nuevo modelo:", error);
        this.copiando = false;
      }
    );
  
    this.secondFormGroup.get('secondCtrl')?.setValidators(Validators.required);
    this.secondFormGroup.get('secondCtrl')?.updateValueAndValidity();
  }
}
