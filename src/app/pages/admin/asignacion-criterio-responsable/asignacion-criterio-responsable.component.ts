// import { Component, OnInit } from '@angular/core';
// import { Asignacion_Criterios } from 'src/app/models/Asignacion-Criterios';
// import { Criterio } from 'src/app/models/Criterio';
// import { Modelo } from 'src/app/models/Modelo';
// import { Usuario2 } from 'src/app/models/Usuario2';
// import { AsignacionCriterioService } from 'src/app/services/asignacion-criterio.service';
// import { CriteriosService } from 'src/app/services/criterios.service';
// import { LoginService } from 'src/app/services/login.service';
// import { ModeloService } from 'src/app/services/modelo.service';
// import { UsuarioService } from 'src/app/services/usuario.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AsignacionProjection } from 'src/app/interface/AsignacionProjection';

// @Component({
//   selector: 'app-asignacion-criterio-responsable',
//   templateUrl: './asignacion-criterio-responsable.component.html',
//   styleUrls: ['./asignacion-criterio-responsable.component.css']
// })
// export class AsignacionCriterioResponsableComponent implements OnInit {
//   listaCriterios: Criterio[] = [];
//   listaResponsables: Usuario2[] = [];
//   listaResponsablesasignados: AsignacionProjection[] = [];
//   asignacionCriterios: Asignacion_Criterios | undefined;
//    // Modificado el tipo de datos a Modelo
//    public isAsignarModalVisible: boolean = false;

//    asignacion: any
//   user: any = null;
//   criterio_id_ver: number;
//   modelo: Modelo = {
//     id_modelo: 0, // Puedes usar un valor predeterminado apropiado
//     nombre: '',
//     fecha_inicio: new Date(),
//     fecha_fin: new Date(),
//     fecha_final_act: new Date(),
//     visible: true,
//     usuario: null // Otra opción puede ser inicializarlo con null
//   };

//   constructor(
//   public modeloService: ModeloService,
//   public login: LoginService,
//   public criterioService: CriteriosService,
//   public usuarioServicio: UsuarioService,
//   private asignacionCriterio: AsignacionCriterioService,
//   private _snackBar: MatSnackBar
  
//   ) {
//     this.criterio_id_ver = 0;
//    }
//   ngOnInit(): void {
//     this.buscarmodeloactivo();
//     this.user = this.login.getUser();
//     this.cargarlistadoResponsables();
    
//   }
//   cargarlistadoResponsablesAsignados(): void{
//     this.asignacionCriterio.verResponsablesPorCriterio(this.modelo.id_modelo,this.criterio_id_ver).subscribe(
//       (responsablesasignados: AsignacionProjection[]) => {
//         this.listaResponsablesasignados = responsablesasignados; 
//         // Asigna la lista de responsables
//         console.log(this.listaResponsablesasignados);
//       },
//       (error: any) => {
//         console.error('Error al obtener los responsables:', error);
//       }
//     );
//   }
//  cargarlistadoResponsables(): void{
//   this.usuarioServicio.getResponsablesList().subscribe(
//     (responsables: Usuario2[]) => {
//       this.listaResponsables = responsables; 
//       // Asigna la lista de responsables
//     },
//     (error: any) => {
//       console.error('Error al obtener los responsables:', error);
//     }
//   );

//  }
  
//   buscarmodeloactivo(): void {
//     this.modeloService.getModeMaximo().subscribe(
//       (data: Modelo) => { // Modificado el tipo de datos del parámetro data
//         this.modelo = data; // Almacena el modelo obtenido en la variable del componente
        
//         this.criterioService.getListaCriteriosAsignados(this.modelo.id_modelo,this.user.id).subscribe(
//           (data: Criterio[]) => {
           
//             // Asignar la respuesta del servicio a la variable listaCriterios
//             this.listaCriterios = data;
            
//           },
//           (error) => {
//             console.error('Error al obtener la lista de criterios:', error);
//           }
//         );
//       },
//       (error) => {
//         console.error('Error al obtener el modelo activo:', error);
//       }
//     );
//   }

  

//   asignarCriterio(idResponsable: number): void { // Modificado el tipo de datos del parámetro criterio
//     console.log(idResponsable);
//     console.log(this.criterio_id_ver);
//     //ya tengo id usuario que es idresponsable .....tengo el id del modelo y tengo el id del criterio
//     this.asignacion = new Asignacion_Criterios();
//     this.asignacion.usuario.id = idResponsable;
//     this.asignacion.criterio.id_criterio = this.criterio_id_ver;
//     this.asignacion.visible = true;
//     this.asignacion.id_modelo=this.modelo.id_modelo
//     this.asignacionCriterio.createAsignacion_Admin(this.asignacion).subscribe(data => {
//       console.log("Datos de asignacion: "+JSON.stringify(data));
//       this.closeAsignarModal();
//       this._snackBar.open('Asignado a responsable correctamente', 'Cerrar', {
//         duration: 3000 // Duración del mensaje en milisegundos
//     });
// }, error => {
//     console.error("Error al asignar: " + error);
//     // En caso de error, mostrar un mensaje de error
//     this._snackBar.open('Error al asignar: ' + error, 'Cerrar', {
//         duration: 5000 // Duración del mensaje en milisegundos
//     });
// });
//   }

//   quitarasignacion(iduser: number){
//     this.asignacionCriterio.asignacion_especifica(iduser, this.modelo.id_modelo, this.criterio_id_ver)
//     .subscribe(
//       asignacion => {
//         this.asignacionCriterios = asignacion;
//         console.log('Asignación encontrada:', asignacion);
        
//         this.asignacionCriterio.deleteAsignacion_Admin(asignacion.id_asignacion).subscribe(
//           (data: Asignacion_Criterios) => {
//             console.log('Asignación eliminada correctamente:', data);
//             this.closeModal();
//             this._snackBar.open('Asignación eliminada correctamente', 'Cerrar', {
//               duration: 3000
//             });
//           },
//           (error: any) => {
//             console.error('Error al eliminar la asignación:', error);
//             // Aquí podrías manejar el error, mostrar un mensaje al usuario, etc.
//           }
//         );
     
//       },
//       error => {
//         console.error('Error al buscar la asignación:', error);
//       }
//     );
//   }

//   openModalAsignados(idCriterio: number) {
//     const modal = document.getElementById('myModal');
//     if (modal) {
//       modal.style.display = 'block';
//     }
//     this.criterio_id_ver = idCriterio;
//     this.cargarlistadoResponsablesAsignados();
//   }

//   // Método para cerrar el modal
//   closeModal() {
//     const modal = document.getElementById('myModal');
//     if (modal) {
//       modal.style.display = 'none';
//     }
//   }
//   stopPropagation(event: MouseEvent) {
//     event.stopPropagation();
// }


// openModalAsignar(idCriterio: number) {
//     this.isAsignarModalVisible = true;
//     this.criterio_id_ver = idCriterio;
//   }

//   closeAsignarModal() {
//     this.isAsignarModalVisible = false;
//   }

//   asignar() {
//     // Lógica para asignar
//   }



// }
