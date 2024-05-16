import { Component, OnInit } from '@angular/core';
import { asigna_R } from 'src/app/models/Asigna-Responsable';
import { Criterio } from 'src/app/models/Criterio';
import { Modelo } from 'src/app/models/Modelo';
import { Notificacion } from 'src/app/models/Notificacion';
import { usuario } from 'src/app/models/Usuario';
import { AsignacionResponsableService } from 'src/app/services/asignacion-responsable.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asigna',
  templateUrl: './asigna.component.html',
  styleUrls: ['./asigna.component.css']
})
export class AsignaComponent implements OnInit {

  usuarioResponsable: usuario[] = [];
  criterios: Criterio[] = [];
  asignaciones: asigna_R[] = [];
  asigna = new asigna_R;
  asignaN = new asigna_R;
  modeloVigente!: Modelo;
  noti=new Notificacion();
  user:any = null;
  idusuario:any=null;
  nombre:any=null;
  nombreasignado:any=null;
  isLoggedIn = false;
  constructor(public login:LoginService, private asignaService: AsignacionResponsableService,private notificationService:NotificacionService) {
 
    if (this.asignaciones == null) {

    }
  }

  ngOnInit(): void {
    this.listaResponsable();
    this.listaCriterios();
    this.listaAsignaciones();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    this.obtenerModeloVigente();
    //Directamente guardar en el objeto notificacion el modelo
    this.noti.id_modelo = this.modeloVigente.id_modelo;
  }

  obtenerModeloVigente(){
    this.modeloVigente= JSON.parse(localStorage.getItem('modelo') || '{}');
  }
  listaResponsable() {
    this.asignaService.listarUsuario().
      subscribe(data => {
        this.usuarioResponsable = data;
        console.log(this.usuarioResponsable);
      })
  }

  listaCriterios() {
    this.asignaService.listarCriterios().
      subscribe(data => {
        this.criterios = data;
        console.log(this.criterios);
      })
  }

  listaAsignaciones() {
    this.asignaService.listarAsignarResponsable().
      subscribe(data => {
        this.asignaciones = data;
        console.log(this.asignaciones);
      })
  }

  notificar() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre+" "+this.user.persona.primer_apellido+" ha asignado el criterio " + this.nombre
    +" a "+this.nombreasignado;
    this.noti.visto = false;
    this.noti.usuario =  0;

    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaruser() {
    this.noti.fecha = new Date();
    this.noti.rol = "";
    this.noti.mensaje = this.user.persona.primer_nombre+" "+this.user.persona.primer_apellido+" te ha asignado el criterio " + this.nombre;
    this.noti.visto = false;
    this.noti.usuario =  this.idusuario;

    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }
  
  notificaradmin() {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre+" "+this.user.persona.primer_apellido+" ha asignado el criterio " + this.nombre
    +" a "+this.nombreasignado;
    this.noti.visto = false;
    this.noti.usuario =  0;

    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  guardar(asigna: asigna_R) {
    console.log(asigna.criterio);
    if (asigna.usuario != null || asigna.usuario != undefined ||
      asigna.criterio != null || asigna.criterio != undefined) {
      this.asignaService.createAsigna(asigna).
        subscribe(data => {
          asigna = data;
          this.idusuario=data.usuario.id;
          this.nombreasignado=data.usuario.username;
          this.nombre=data.criterio.nombre;
          Swal.fire({
            title: 'Asignado éxitosamente',
            icon: 'success',
            iconColor: '#17550c',
            color: "#0c3255",
            confirmButtonColor: "#0c3255",
            background: "#63B68B",
          })
          this.listaAsignaciones();
          this.notificar();
          this.notificaruser();
          this.notificaradmin();
          console.log("hhh" + asigna);
        })
    }else{
      Swal.fire('Llene todos los campos', '', 'warning')
    }

  }

  editar(asigna: asigna_R): void {
    localStorage.setItem("id_asig", asigna.id_asignacion.toString());
    console.log(asigna.id_asignacion)
    this.asignaN = asigna;
    this.Editar();
    //this.router.navigate(['admin/editProduc']);
  }

  Editar() {

    let id = localStorage.getItem("id_asig");
    console.log(id);
    this.asignaService.getAsignacionId(Number(id))
      .subscribe(data => {
        this.asignaN = data;
        this.idusuario=data.usuario.id;
          this.nombreasignado=data.usuario.username;
          this.nombre=data.criterio.nombre;
        console.log(this.asignaN)
      })
      this.listaAsignaciones();
      this.notificar();
      this.notificaruser();
      this.notificaradmin();
  }

  Actualizar(asignaNu: asigna_R) {
    console.log(asignaNu)
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //COLOCAR EL CODIGO A EJECUTAR
        this.asignaService.updateAsigna(asignaNu)
          .subscribe(data => {
            this.asignaN = data;
            Swal.fire({
              title: 'Asignacion modificada éxitosamente',
              icon: 'success',
              iconColor: '#17550c',
              color: "#0c3255",
              confirmButtonColor: "#0c3255",
              background: "#63B68B",
            })
            this.listaAsignaciones();
            this.notificar();
            this.notificaradmin();
            this.notificaruser();
            //alert("Se Actualiazo");
            //this.router.navigate(['admin/crudProduc'])
          });
        //FIN DEL CODIGO A EJECUTAR
        //Swal.fire('Modificado!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Ningun campo modificado', '', 'info')
      }
    })


  }


  eliminar(asigna: asigna_R) {
    Swal.fire({
      title: '¿Esta Seguro?',
      text: "No será capaz de revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        //COLOCAR EL CODIGO A EJECUTAR
        this.asignaService.deleteAsigna(asigna)
          .subscribe(data => {
            this.asignaciones = this.asignaciones.filter(p => p !== asigna);
            Swal.fire(
              'Borrado!',
              'Su archivo ha sido borrado.',
              'success'
            )
          });
        //FIN DEL CODIGO A EJECUTAR

      }
    })
  }

}
