import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tap, catchError, throwError } from 'rxjs';
import { AsigEvidProjection } from 'src/app/interface/AsigEvidProjection';
import { AsignaProjection } from 'src/app/interface/AsignaProjection';
import { ResponsableProjection } from 'src/app/interface/ResponsableProjection';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { Criterio } from 'src/app/models/Criterio';
import { Evidencia } from 'src/app/models/Evidencia';
import { Fenix } from 'src/app/models/Fenix';
import { Modelo } from 'src/app/models/Modelo';
import { Notificacion } from 'src/app/models/Notificacion';
import { Persona2 } from 'src/app/models/Persona2';
import { Usuario2 } from 'src/app/models/Usuario2';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { AsignacionResponsableService } from 'src/app/services/asignacion-responsable.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { FenixService } from 'src/app/services/fenix.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
let ELEMENT_DATA: Fenix[] = [];

@Component({
  selector: 'app-evalucion',
  templateUrl: './evalucion.component.html',
  styleUrls: ['./evalucion.component.css']
})
export class EvalucionComponent implements OnInit {
  columnas: string[] = ['id', 'nombre', 'rol', 'usuario','evidencia', 'actions'];
  columnasEvidencia: string[] = ['subcriterio', 'indicador', 'descripcion', 'idevi','actions'];
  columnasEvidenciaAsignacion: string[] = ['usuario','criterio','subcriterio', 'evidencia',  'idasigna', 'ideviden','descripcion','inicio','fin', 'actions'];
  rowspanArray: number[] = [];
  id_mod!:number;
  spans2: any[] = [];
  idasigna!:number;
  asignar: Asigna_Evi = new Asigna_Evi();
  asignar2: Asigna_Evi = new Asigna_Evi();
  titulocrite!:string;
  public mostrarBotonEditarFecha: boolean = false;
  //Cambiar texto tabla
  itemsPerPageLabel = 'Datos por página';
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
  //
  usuarioGuardar = new Usuario2();
  dataSource2 = new MatTableDataSource<ResponsableProjection>();
  dataSource3 :any[] = [];
  spans: any[] = [];
  dataSource4 :any[] = [];
  fenix: Fenix = new Fenix();
  listaPersonas: Persona2[] = [];
  listaUsuarios: ResponsableProjection[] = [];
  listaUsuariosResponsables: ResponsableProjection[] = [];
  listaEvidencias: AsigEvidProjection[] = [];
  selectedCriterio: number=0;
  listaAsignaEvidencias: AsignaProjection[] = [];
  listacriterios:Criterio[] = [];
  filterPost = '';
  personaSele = new Persona2();
  evidenciaSele = new Evidencia();
  usuarioSele = new Usuario2();
  usuariosEdit = new Usuario2();
  usuariosEditGuar = new Usuario2();
  asignacion = new Asigna_Evi();
  asigedit = new Asigna_Evi();
  formulario: FormGroup;
  roles = [
    { rolId: 3, rolNombre: 'RESPONSABLE' },
  ];
  public rol = 0;
  mostrarbotonDetalle = false;
  @ViewChild('paginator') paginator?: MatPaginator;
  @ViewChild('paginator2') paginator2?: MatPaginator;
  @ViewChild('paginator3') paginator3?: MatPaginator;
  isLoggedIn = false;
  user: any = null;
  //
  noti=new Notificacion();
  idusuario:any=null;
  nombre:any=null;
  inicio:any;
  fin:any;
  nombreasignado:any=null;
  verSubcriterio=false;
  verIndicador=true;
  verDescripcion=true;
  ocultar=false;
  rowSpanValue: number = 0;
  vernomIndicador=true;
  ngAfterViewInit() {
     // Usuarios
     this.dataSource2.paginator = this.paginator|| null
     // Evidencias
    // this.dataSource3.paginator = this.paginator2|| null
     // Asignaciones
    // this.dataSource4.paginator = this.paginator3|| null
    this.Listado();
  }

  constructor(
    private personaService: PersonaService, private usuariosService: UsuarioService,
    private fenix_service: FenixService, private criteservice:CriteriosService,
    private responsableService: AsignacionResponsableService,
    private evidenciaService: EvidenciaService,
    private asignarEvidenciaService: AsignaEvidenciaService,
    private formBuilder: FormBuilder,
    public login: LoginService, private paginatorIntl: MatPaginatorIntl,
    private notificationService:NotificacionService
  ) {
    this.formulario = this.formBuilder.group({
      username: { value: '', disabled: true },
      password: ['', Validators.required]
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
    this.dataSource2.data = this.listaUsuarios;
    
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    );
this.criterioSeleccionado();
this.criteservice.getCriterios().subscribe(
  data => {
    this.listacriterios=data;
  }
);
    this.personaService.getPersonas().subscribe(
      listaPerso => this.listaPersonas = listaPerso);

    this.Listado();
    this.ListarAsignacion();
    this.modeloMax();
  }

  aplicar() {
    this.dataSource3.forEach(element => {
      element.randomColor = this.generarColor();
    });
    this.dataSource3.forEach(element => {
      element.Colores = this.generarColor2();
    });
   
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
  
 
  calcularRowSpanValue(index: number): void {
    this.rowSpanValue = this.getRowSpan2('descripcion', index);
  }
  modeloMax() {
    this.criteservice.getModeMaximo().subscribe((data) => {
      this.id_mod =data.id_modelo;
    this.inicio=data.fecha_inicio;
  this.fin=data.fecha_fin;})
    }

  
  cacheSpan2(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource3.length;) {
      let currentValue = accessor(this.dataSource3[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource3.length; j++) {
        if (currentValue !== accessor(this.dataSource3[j])) {
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
  
  
  getRowSpan2(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
  notificaruser() {
    this.noti.fecha = new Date();
    this.noti.rol = "";
    this.noti.mensaje = this.user?.persona?.primer_nombre+" "+this.user?.persona?.primer_apellido+" te ha asignado la evidencia " + this.nombreasignado;
    this.noti.visto = false;
    this.noti.usuario =  this.idusuario;
    this.noti.url="/res/evidenasignada";
    this.noti.idactividad=0;
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
    this.noti.mensaje = this.user?.persona?.primer_nombre+" "+this.user?.persona?.primer_apellido+" ha asignado la evidencia " + this.nombreasignado
    +" a "+this.nombre;
    this.noti.visto = false;
    this.noti.usuario =  0;
    this.noti.url="/adm/detalleAprobarRechazar";
    this.noti.idactividad=0;
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
  notificarsuperadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user?.persona?.primer_nombre+" "+this.user?.persona?.primer_apellido+" ha asignado la evidencia " + this.nombreasignado
    +" a "+this.nombre;
    this.noti.visto = false;
    this.noti.usuario =  0;
    this.noti.url="/sup/aprobaciones";
    this.noti.idactividad=0;
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
  notificarelimadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user?.persona?.primer_nombre+" "+this.user?.persona?.primer_apellido+" ha eliminado la asignacion de la evidencia " + this.nombreasignado
    +" a "+this.nombre;
    this.noti.visto = false;
    this.noti.usuario =  0;
    this.noti.url="/adm/detalleAprobarRechazar";
    this.noti.idactividad=0;
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
  notificarelsupern() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user?.persona?.primer_nombre+" "+this.user?.persona?.primer_apellido+" ha eliminado la asignacion de la evidencia " + this.nombreasignado
    +" a "+this.nombre;
    this.noti.visto = false;
    this.noti.usuario =  0;
    this.noti.url="/sup/aprobaciones";
    this.noti.idactividad=0;
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
  displayedColumns: string[] = [
    'cedula',
    'primer_apellido',
    'segundo_apellido',
    'primer_nombre',
    'segundo_nombre',
    'celular',
    'acciones'];

  dataSource = ELEMENT_DATA;


  //consumir servicio de fenix para obtener datos de la persona por cedula
  public consultarPorNombreCompleto(){
    if (this.fenix.primer_nombre == null && this.fenix.primer_apellido == null || this.fenix.primer_nombre == "" && this.fenix.primer_apellido == ""){
      Swal.fire('Error', 'Debe llenar los campos', 'error');
      return; 
    }
    this.fenix_service.getDocenteByNombresCompletos(this.fenix.primer_nombre,this.fenix.primer_apellido).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }
  
  public consultarPorCedula() {
    if (this.fenix.cedula == null || this.fenix.cedula == '') {
      Swal.fire('Error', 'Debe ingresar una cedula', 'error');
      return;
    }
    console.log('si entra');
    this.fenix_service.getDocenteByCedula(this.fenix.cedula).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_apellido
  public consultarPorApellido() {
    if (this.fenix.primer_apellido == null || this.fenix.primer_apellido == '') {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerApellido(this.fenix.primer_apellido).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por segundo_apellido
  public consultarPrimerNombre() {
    if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire('Error', 'Debe ingresar un nombre', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerNombre(this.fenix.primer_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }
  //metodo para obtener docentes por primer_apellido y segundo_apellido
  public consultarPorPrimerApellidoAndSegundoApellido() {
    if ((this.fenix.primer_apellido == null || this.fenix.primer_apellido == '') && (this.fenix.segundo_apellido == null || this.fenix.segundo_apellido == '')) {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerApellidoAndSegundoApellido(this.fenix.primer_apellido, this.fenix.segundo_apellido).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //crear un metodo que una los servicios de cedula, primer_apellido y segundo_apellido
  public consultar() {
    if (this.fenix.primer_nombre && this.fenix.primer_apellido) {
      this.consultarPorNombreCompleto();
    } else if (this.fenix.cedula) {
      this.consultarPorCedula();
    } else if (this.fenix.primer_apellido && this.fenix.segundo_apellido) {
      this.consultarPorPrimerApellidoAndSegundoApellido();
    } else if (this.fenix.primer_apellido) {
      this.consultarPorApellido();
    } else if (this.fenix.primer_nombre) {
      this.consultarPrimerNombre();
    } else {
      Swal.fire('Error', 'Debe ingresar un valor a buscar', 'error');
      return;
    }
  }
  
  public seleccionar(element: any) {
    this.personaSele.cedula = element.cedula;
    this.personaSele.primer_apellido = element.primer_apellido;
    this.personaSele.segundo_apellido = element.segundo_apellido;
    this.personaSele.primer_nombre = element.primer_nombre;
    this.personaSele.segundo_nombre = element.segundo_nombre;
    this.personaSele.celular = element.celular;
    this.personaSele.correo = element.correo;
    this.personaSele.direccion = element.direccion;
    console.log(this.personaSele);
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.persona = this.personaSele;
  }

  public seleccionarUsuario(elemento: any) {
    this.usuarioSele.id = elemento.id;
    this.usuarioSele.username = elemento.usua;
    this.usuarioSele.persona = elemento.nombres;
    this.nombre=elemento.nombres;
  }

  public AsignaUsuario(element: any) {
    if (this.asignar.fecha_inicio == null || this.asignar.fecha_fin == null) {
      Swal.fire('Error', `Debe llenar todos los campos`, 'error');
      return;
    }

    if (this.asignar.fecha_inicio >= this.asignar.fecha_fin) {
      Swal.fire('Error', `La fecha de inicio no puede ser mayor a la fecha fin`, 'error');
      return;
    }
    this.asignacion.evidencia.id_evidencia = element.idev;
    this.nombreasignado=element.descripc;
    this.asignacion.usuario.id = this.usuarioSele.id;
    this.asignacion.id_modelo=this.id_mod;
    this.asignacion.fecha_inicio=this.asignar.fecha_inicio;
    this.asignacion.fecha_fin=this.asignar.fecha_fin;
    console.log(this.asignacion)
    this.asignarEvidenciaService.createAsigna(this.asignacion)
      .subscribe(
        (response) => {
          this.idusuario=this.usuarioSele.id;
          console.log("Nombre asignado "+this.nombreasignado+ " Nombre "+this.nombre+" id: "+this.idusuario);
          this.notificaradmin();
          this.notificarsuperadmin();
          this.notificaruser();
          this.listar();
          this.Listado();
          this.ListarAsignacion();
          
          Swal.fire(
            'Exitoso',
            'Se ha completado la asignación con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al asignar usuario', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
  }
  // Supongamos que elemento.fecha_fin contiene la fecha de finalización.
  // Debes calcular si la fecha de finalización ha pasado.
  public isFechaPasada(elemento: any): boolean {
    const fechaFin = new Date(elemento.fecha_fin);
    const fechaActual = new Date();
    return fechaFin < fechaActual;
  }


  public editarFecha(elemento: any): void {
    // Aquí puedes implementar la lógica para editar la fecha
    // Puedes mostrar un cuadro de diálogo o redirigir a una página de edición de fecha.
  }
  
  showSubcriterio() {
    this.verSubcriterio = !this.verSubcriterio;
  }
  
  showIndicador() {
    this.verIndicador = !this.verIndicador;
  }

  listar() {
    
    this.evidenciaService.getevitab(this.selectedCriterio).subscribe(
      (listaEvi:AsigEvidProjection[]) => {
        this.listaEvidencias = listaEvi; // Asignar la lista directamente
        this.dataSource3 = this.listaEvidencias;
       
        setTimeout(() => {
          this.aplicar();
        }, 0);
      }
    );
  }
  MostrarBotonDetalleEvalucaion() {
    this.mostrarbotonDetalle = true;
    this.ListarAsignacion();
  }
  OcultarbotonDetalleEvalucaion() {
    this.mostrarbotonDetalle = false;
  }

 ListarAsignacion() {
  this.dataSource4 = [];
    this.spans2 =[];
  this.asignarEvidenciaService.getAsignacion().subscribe(
    (listaAsig:AsignaProjection[]) => {
      this.listaAsignaEvidencias = listaAsig;
      this.dataSource4 = this.listaAsignaEvidencias;
      console.log("DAtos as "+JSON.stringify(this.dataSource4));
      //'idasigna', 'criterio','subcriterio', 'evidencia', 'usuario', 'descripcion', 'actions'
      this.cacheSpan('usuario', (d) => d.respon);
  this.cacheSpan('criterio', (d) => d.respon+d.crite);
  this.cacheSpan('subcriterio', (d) => d.respon+d.crite + d.subcrite);
  this.cacheSpan('evidencia', (d) => d.respon+d.crite + d.subcrite+d.indi);
  this.cacheSpan('idasigna', (d) => d.respon+d.crite + d.subcrite+d.indi+d.idevid);
  this.cacheSpan('ideviden', (d) => d.respon+d.crite + d.subcrite+d.indi+d.idevid+d.ideviden);
  this.cacheSpan('descripcion', (d) =>d.respon+ d.crite + d.subcrite+d.indi+d.idevid+d.ideviden+d.descev);
  })
}

  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource4.length;) {
      let currentValue = accessor(this.dataSource4[i]);
      let count = 1;
  
      for (let j = i + 1; j < this.dataSource4.length; j++) {
        if (currentValue !== accessor(this.dataSource4[j])) {
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

  getRowSpan(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
  }

  Listado() {
    this.responsableService.getResponsables().subscribe(
      listaUsua => {
        this.listaUsuariosResponsables = listaUsua;
        this.dataSource2.data = this.listaUsuariosResponsables;
        console.log(this.listaUsuariosResponsables);
      }
    );
  }

  public seleccionar2(element: any) {
    this.personaSele = element;
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.persona.id_persona = this.personaSele.id_persona;
  }

  EditarUsuari(usuariossssss: Usuario2): void {
    this.usuariosEdit = usuariossssss
  }


  limpiarFormulario() {
  }

  registrarUsuario() {
    console.log(this.usuarioGuardar)
    this.personaService.findByCedula(this.personaSele.cedula).subscribe(
      (data2: Persona2) => {
        if (!data2) { // Si no se encuentra ningún resultado
          this.personaService.createPersona(this.personaSele).subscribe(
            (data) => {
              console.log(data);
              this.usuarioGuardar.username = data.cedula;
              this.usuarioGuardar.persona = data;
              this.crearUsuario();
            },
            (error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar a la persona',
                text: 'Error al registrar!',
                footer: '<a href=""></a>',
              });
            }
          );
        } else {
          // Aquí puedes agregar código adicional para manejar el caso cuando se encuentra una persona con la misma cédula
          this.usuarioGuardar.username = data2.cedula;
          this.usuarioGuardar.persona = data2;
          this.crearUsuario();
        }
      },
      (error: any) => {
        console.error('Error al listar los indicadores:', error);
      }
    );
  }

  crearUsuario() {
    
    console.log(this.usuarioGuardar)
    this.usuariosService.createUsuario(this.usuarioGuardar, this.rol).subscribe(
      () => {
        Swal.fire(
          'Usuario Registrado!',
          'El usuario ha sido registrado éxitosamente',
          'success'
        );
        this.Listado();

        this.formulario.reset();
        this.formulario.markAsPristine();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar usuario',
          text: 'Error al registrar!',
          footer: '<a href=""></a>',
        });
      }
    );
  }

  guardarUsuario() {
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.password = this.formulario.value.password;
    this.rol = 3;
    console.log(this.usuarioGuardar.username)
    console.log(this.usuarioGuardar.password)
    console.log(this.rol)
    if (!this.usuarioGuardar.username || !this.usuarioGuardar.password || !this.rol) {
      Swal.fire('Campos Vacios', 'Por favor llene todos los campos', 'warning');
      return;
    }

    this.usuariosService.obtenerUsuario(this.usuarioGuardar.username).pipe(
      tap((existeUsuario: boolean) => {
        if (existeUsuario) {
          Swal.fire('Usuario existente', 'El usuario ya está registrado', 'warning');
        } else {
          this.registrarUsuario();
        }
      }),
      catchError((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al comprobar usuario',
          text: 'Error al comprobar la existencia del usuario',
          footer: '<a href=""></a>',
        });
        return throwError(error);
      })
    ).subscribe();
  }











  eliminar(element: any) {
    const id = element.id;

    Swal.fire({
      title: 'Desea eliminarlo?',
      text: "No podrá revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuarioLogic(id).subscribe((response) => {
          this.Listado();
        });

        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  EditarAsigna(element: any){
    this.idasigna= element.idevid;
    this.asignar2.fecha_inicio=element.ini;
    this.asignar2.fecha_fin=element.fini;
  }

  Actualizarfecha(){
    if (this.asignar2.fecha_inicio == null || this.asignar2.fecha_fin == null) {
      Swal.fire('Error', `Debe llenar todos los campos`, 'error');
      return;
    }
  
    if (this.asignar2.fecha_inicio >= this.asignar2.fecha_fin) {
      Swal.fire('Error', `La fecha de inicio no puede ser mayor a la fecha fin`, 'error');
      return;
    }
    Swal.fire({
      title: 'Actualizar',
      text: "Se cambiaran las fechas de esta asignación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.asigedit.id_asignacion_evidencia=this.idasigna;
        this.asigedit.fecha_inicio=this.asignar2.fecha_inicio;
        this.asigedit.fecha_fin=this.asignar2.fecha_fin;
        console.log("Datos actualizar "+JSON.stringify(this.asigedit));
    this.asignarEvidenciaService.editarAsigna(this.asigedit).subscribe((response) => {
      this.ListarAsignacion();
    });

    Swal.fire('Actualizado!', 'Se cambiaron las fechas de las asignaciones.', 'success');
  }
});
  }

  eliminarAsignacion(element: any) {
    const id = element.idevid;
   
    Swal.fire({
      title: 'Desea eliminarlo la asignación?',
      text: "No podrá revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificarelimadmin();
          this.notificarelsupern();
        this.asignarEvidenciaService.eliminarAsignaLogic(id).subscribe((response) => {
          this.nombreasignado = element.descev;
          this.ListarAsignacion();
        });

        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  Actualizar(usuariosdit: Usuario2) {
    usuariosdit.id=this.usuariosEdit.id;
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuariosService.actualizar(usuariosdit.id, usuariosdit)
        .subscribe((response: any) => {
          Swal.fire(
            'Usuario Modificado!',
            'El usuario ha sido modificado éxitosamente',
            'success'
          );
          this.Listado();
          this.usuariosEdit=new Usuario2();
          this.usuariosEditGuar=new Usuario2();
        });
    } else{
      Swal.fire('Se ha cancelado la operación', '', 'info')
    }
    })


  }

  criterioSeleccionado() {
    this.dataSource3 = [];
    this.spans =[];
    if (this.selectedCriterio!=0) {
      const criterioSeleccionado = this.listacriterios.find(criterio => criterio.id_criterio === this.selectedCriterio);
      this.titulocrite = "Evidencias del criterio "+criterioSeleccionado?.nombre || '';
      this.evidenciaService.getevitab(this.selectedCriterio).subscribe(
        (listaEvi:AsigEvidProjection[]) => {
          this.listaEvidencias = listaEvi;
          this.dataSource3 = this.listaEvidencias;
          this.cacheSpan2('subcriterio', (d) => d.nombsub);
          this.cacheSpan2('indicador', (d) => d.nombsub + d.nombind);
          this.cacheSpan2('descripcion', (d) => d.nombsub + d.nombind + d.descripc);
          this.cacheSpan2('idevi', (d) => d.nombsub + d.nombind +d.descripc+ d.idev);
            console.log("lista evidencias"+this.listaEvidencias);
            setTimeout(() => {
              this.aplicar();
            }, 0);
          
          console.log("evidenica lisra"+JSON.stringify(this.dataSource3))
        }
      );
  } else {
    this.titulocrite = "Debe seleccionar un criterio para ver sus evidencias";
  }
}
}
