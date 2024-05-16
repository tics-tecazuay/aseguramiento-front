import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioRol } from 'src/app/models/UsuarioRol';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { Fenix } from 'src/app/models/Fenix';
import { FenixService } from 'src/app/services/fenix.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import { catchError, tap, throwError, timer } from 'rxjs';
import { Usuario2 } from 'src/app/models/Usuario2';
import { Persona2 } from 'src/app/models/Persona2';
import { CriteriosService } from 'src/app/services/criterios.service';
import { CriteUsuarioProjection } from 'src/app/interface/CriteUsuarioProjection';
import { ThemePalette } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Rol } from 'src/app/models/Rol';
import { CriRespProjection } from 'src/app/interface/CriteRespProjection';
import { UsuariosProjection } from 'src/app/interface/UsuariosProjection';


let ELEMENT_DATA: Fenix[] = [];

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css'],
})
export class CrearUsuariosComponent implements OnInit {

  usuarioGuardar = new Usuario2();
  fenix: Fenix = new Fenix();
  listaPersonas: Persona2[] = [];
  selectedRole: string | null = null;
  listaUsuarios: UsuariosProjection[] = [];
  filterPost = '';
  personaSele = new Persona2();

  usuarioEdit = new Usuario2();
  usuarioSele = new UsuarioRol();

  usuariosEdit = new UsuarioRol();
  usuariosEditGuar = new UsuarioRol();
  usuarioBd = new UsuarioRol();
  selectedRol: any;
  searchTerm: string = '';
  asig!: UsuariosProjection[];
  criterio!: CriteUsuarioProjection[];
  dato: number = 23;

  dataSource5: Usuario2[] = [];

  usuariosCreados: Usuario2[] = [];
  //Cambiar texto tabla
  itemsPerPageLabel = 'Usuarios por página';
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

  //
  roles = [
    { rolId: 1, rolNombre: 'ADMIN' },
    { rolId: 2, rolNombre: 'SUPERADMIN' },
    { rolId: 3, rolNombre: 'RESPONSABLE' },
    { rolId: 4, rolNombre: 'AUTORIDAD' },
  ];

  rolesOrd = [
    { rolId: 2, rolNombre: 'SUPERADMIN', selected: false },
    { rolId: 1, rolNombre: 'ADMIN', selected: false },
    { rolId: 3, rolNombre: 'RESPONSABLE', selected: false },
    { rolId: 4, rolNombre: 'AUTORIDAD', selected: false },
  ];

  rolesUserBase: Rol[] = [];

  public usuario = {
    username: '',
    password: ''
  }

  public rol = 0;
  ocultar = false;
  idmodel!: number;
  formulario: FormGroup;
  user: CriRespProjection[] = [];
  spans: any[] = [];
  isLoading = false;
  dataSource2 = new MatTableDataSource<UsuariosProjection>();
  columnasUsuario: string[] = ['id', 'idrol', 'nombre', 'usuario', 'rol', 'criterio', 'actions'];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild('modal') modal: any;
  constructor(
    private personaService: PersonaService,
    private usuariosService: UsuarioService,
    private criterioService: CriteriosService,
     private httpCriterios: CriteriosService,
    private fenix_service: FenixService,
    private formBuilder: FormBuilder,
    private paginatorIntl: MatPaginatorIntl,
    private usuariorolservice: UsuariorolService
  ) {
    this.formulario = this.formBuilder.group({
      username: { value: '', disabled: true },
      password: ['', Validators.required],
    });
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.isLoading = true;
    this.personaService.getPersonas().subscribe(
      listaPerso => this.listaPersonas = listaPerso);
    this.modeloMax();

  }

  modeloMax() {
    this.httpCriterios.getModeMaximo().subscribe((data) => {
      this.idmodel = data.id_modelo;
      this.Listado();
    });
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
  getUsarioBase(username: string) {
    this.usuariorolservice.buscaruser(username).subscribe(
      (data) => {
        this.usuarioBd = data;
      }
    );
  }
  public consultarPorCedula() {
    if (this.fenix.cedula == null || this.fenix.cedula == '') {
      Swal.fire('Error', 'Debe ingresar una cedula', 'error');
      return;
    }

    this.fenix_service.getDocenteByCedula(this.fenix.cedula).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_nombre
  public consultarPorNombre() {
    /*if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire('Error', 'Debe ingresar un nombre', 'error');
      return;
    }*/
    if (this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un nombre válido',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    this.fenix_service.getDocenteByPrimerNombre(this.fenix.primer_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por segundo_nombre
  public consultarPorSegundoNombre() {
    if (this.fenix.segundo_nombre == null || this.fenix.segundo_nombre == '') {
      Swal.fire('Error', 'Por favor, ingrese un nombre válido', 'error');
      return;
    }
    this.fenix_service.getDocenteBySegundoNombre(this.fenix.segundo_nombre).subscribe(
      (result) => {
        this.dataSource = result;
      }
    )
  }

  //consumir servicio de fenix para obtener datos de la persona por primer_nombre y segundo_nombre
  public consultarPorPrimerNombreSegundoNombre() {
    if ((this.fenix.primer_nombre == null || this.fenix.primer_nombre == '') && (this.fenix.segundo_nombre == null || this.fenix.segundo_nombre == '')) {
      Swal.fire('Error', 'Por favor, ingrese los nombres válidos', 'error');
      return;
    }
    this.fenix_service.getDocenteByPrimerNombreSegundoNombre(this.fenix.primer_nombre, this.fenix.segundo_nombre).subscribe(
      (result) => {
        this.dataSource = result;
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
  public consultarPorSegundoApellido() {
    if (this.fenix.segundo_apellido == null || this.fenix.segundo_apellido == '') {
      Swal.fire('Error', 'Debe ingresar un apellido', 'error');
      return;
    }
    this.fenix_service.getDocenteBySegundoApellido(this.fenix.segundo_apellido).subscribe(
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

  //crear un metodo que una los servicios de cedula, primer_nombre,primer_apellido, segundo_nombre y segundo_apellido
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

  public consultarPorNombreCompleto() {
    if (this.fenix.primer_nombre == null && this.fenix.primer_apellido == null || this.fenix.primer_nombre == "" && this.fenix.primer_apellido == "") {
      Swal.fire('Error', 'Debe llenar los campos', 'error');
      return;
    }
    this.fenix_service.getDocenteByNombresCompletos(this.fenix.primer_nombre, this.fenix.primer_apellido).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(this.dataSource);
      }
    )
  }

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

  public seleccionar2(element: any) {
    this.personaSele = element;
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.persona.id_persona = this.personaSele.id_persona;
  }

  limpiarFormulario() {
    this.usuarioGuardar = new Usuario2;

    //this.selectedRol = null;
    // this.rol=0;
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
                title: 'No se pudo registrar persona',
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
        console.error('Error al listar los indicadors:', error);
      }
    );
  }

  crearUsuario() {
    this.isLoading = true;
    console.log(this.usuarioGuardar)
    this.usuariosService.createUsuarioSup(this.usuarioGuardar, this.getRolesSeleccionados()).subscribe(
      (response) => {
        Swal.fire(
          'Usuario Registrado!',
          'El usuario ha sido registrado éxitosamente',
          'success'
        );
        this.Listado();
        //this.recargarPagina();
        this.formulario.reset();
        this.formulario.markAsPristine();
      },
      (error) => {
        this.isLoading = false;
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
    this.isLoading = true;
    // Obtener los roles seleccionados
    const rolesSeleccionados = this.rolesOrd.filter(rol => rol.selected);
    this.usuarioGuardar.username = this.personaSele.cedula;
    this.usuarioGuardar.password = this.formulario.value.password;
    console.log(this.usuarioGuardar.username)
    console.log(this.usuarioGuardar.password)
    // Verificar que todos los campos necesarios estén completos
    if (!this.usuarioGuardar.username || !this.usuarioGuardar.password || rolesSeleccionados.length === 0) {
      this.isLoading = false;
      Swal.fire('Campos Vacios', 'Por favor llene todos los campos', 'warning');
      return;
    }
    this.usuariosService.obtenerUsuario(this.usuarioGuardar.username).pipe(
      tap((existeUsuario: boolean) => {
        if (existeUsuario) {
          this.isLoading = false;
          Swal.fire('Usuario existente', 'El usuario ya está registrado', 'warning');
        } else {
          this.registrarUsuario();
        }
      }),
      catchError((error) => {
        console.log(error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al comprobar usuario',
          text: 'Error al comprobar la existencia del usuario',
          footer: '<a href=""></a>',
        });
        return throwError(error);
      })
    ).subscribe();
    this.isLoading = false;
  }

  cerrarModal() {
    this.formulario.reset();
    this.formulario.markAsPristine();
  }

  recargarPagina() {
    // Recargar la página actual
    timer(1000).subscribe(() => location.reload());
  }

  eliminar(id: number) {
    //const id = element.id;
    Swal.fire({
      title: 'Desea eliminarlo?',
      text: "No podrá revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
    }).then((result) => {
      this.isLoading = true;
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuarioLogic(id).subscribe(
          (response) => {
            // Esta función se ejecutará si la operación de eliminar usuario se completa con éxito
            this.isLoading = false;
            Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
            this.Listado();
            this.recargarPagina();
          },
          (error) => {
            // Esta función se ejecutará si hay algún error en la operación de eliminar usuario
            console.error("Error al eliminar usuario:", error);
            // Aquí puedes manejar el error según tus necesidades
            this.recargarPagina();
          }
        );
      
      }else{
        this.isLoading = false;
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    });    
  }

  public selec(element: UsuariosProjection) {

    this.usuarioSele.usuarioRolId = element.userrolid
    this.usuarioEdit.username = element.usuario
    this.usuarioEdit.password = element.contrasenia
  }

  usuarioSeleccionado: string = "";
  contraseniaSeleccionado: string = "**********";

  handleClick(usuario: string, element: UsuariosProjection) {

    this.EditarUsuari(usuario)
    this.selec(element)

  }

  EditarUsuari(usuario: string): void {

    this.usuarioSeleccionado = usuario;
    // Obtener los roles del usuario base
    this.usuariorolservice.getRolesPorUsername(usuario).subscribe(

      (data: Rol[]) => {
        // Almacenar los roles del usuario base en rolesUserBase
        this.rolesUserBase = data;
        // Iterar sobre los roles disponibles
        this.rolesOrd.forEach(rol => {
          // Verificar si el usuario tiene asignado el rol actual
          // Utilizamos some() para verificar si el rol está presente en la lista de roles del usuario base
          rol.selected = this.rolesUserBase.some((rolUsuario: Rol) => rolUsuario.rolId === rol.rolId);
        });
      }
    );
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.rolNombre === role2.rolNombre : role1 === role2;
  }


  Actualizar(usuariosdit: UsuarioRol, idrol:number) {
    this.isLoading= true;

  // Verificar que se seleccione al menos un rol
  const rolesSeleccionados = this.rolesOrd.filter(rol => rol.selected);
  if (rolesSeleccionados.length === 0) {
    this.isLoading= false;
    Swal.fire('Rol Requerido', 'Por favor, seleccione al menos un rol', 'warning');
    return; // No continuar con el proceso si no se selecciona ningún rol
  }
    usuariosdit.usuarioRolId = this.usuariosEdit.usuarioRolId;
    console.log(usuariosdit)
    this.isLoading = false;
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.usuariorolservice.actualizarSup(idrol, usuariosdit, this.getRolesSeleccionados())
          .subscribe((response: any) => {
            this.isLoading = false;
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.isLoading = true;
            this.usuariosEdit = new UsuarioRol();
            this.usuariosEditGuar = new UsuarioRol();
            this.Listado();
            this.recargarPagina();
            this.isLoading = false;
          },(error)=>{
            this.isLoading = false;
            Swal.fire('Error', 'Error al modificar el usuario', 'error');
          } );
      } else {
        this.isLoading = false;
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    })
  }


  Actualizar3(usuariosEditGuar: UsuarioRol) {
    const usuarioProjection: UsuariosProjection = {
      id: usuariosEditGuar.usuario.id,
      nombres: usuariosEditGuar.usuario.username,
      usuario: usuariosEditGuar.usuario.username,
      rolnombre: usuariosEditGuar.rol.rolNombre,
      criterionombre: usuariosEditGuar.rol.rolNombre,
      evidencianombre: usuariosEditGuar.rol.rolNombre,
      userrolid: usuariosEditGuar.usuarioRolId,
      contrasenia: usuariosEditGuar.usuario.password,
    };

    console.log(usuarioProjection.userrolid);
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariorolservice.actualizarSup(usuarioProjection.userrolid, usuariosEditGuar, this.getRolesSeleccionados())
          .subscribe((response: any) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.Listado();
            this.usuariosEdit = new UsuarioRol();
            this.usuariosEditGuar = new UsuarioRol();
          });
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info');
      }
    });
  }

  Actualizar2(usuariosdit: UsuariosProjection) {
    if (usuariosdit.contrasenia === "") {
      usuariosdit.contrasenia = this.usuariosEdit.usuario.password
    }
    console.log(usuariosdit);
    Swal.fire({
      title: '¿Desea modificar los campos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariorolservice.actualizarSup(usuariosdit.userrolid, usuariosdit, this.getRolesSeleccionados())
          .subscribe((response: any) => {
            Swal.fire(
              'Usuario Modificado!',
              'El usuario ha sido modificado éxitosamente',
              'success'
            );
            this.Listado();
            this.usuariosEdit = new UsuarioRol();
            this.usuariosEditGuar = new UsuarioRol();
          });
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info');
      }
    });
  }


  allComplete: boolean = false;

  toggleCheckbox(rol: any) {
    rol.selected = !rol.selected;
    this.allComplete = this.rolesOrd.every(rol => rol.selected);

    // Obtener los roles seleccionados al dar clic en el checkbox
    const rolesSeleccionados = this.getRolesSeleccionados();
    console.log('Roles seleccionados:', rolesSeleccionados);
    // Puedes hacer algo con los roles seleccionados aquí, como enviarlos a través de una solicitud HTTP, etc.
  }

  getRolesSeleccionados(): number[] {
    return this.rolesOrd.filter(rol => rol.selected).map(rol => rol.rolId);
  }

  //Contador para combinar celdas
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.asig.length;) {
      let currentValue = accessor(this.asig[i]);
      let count = 1;

      for (let j = i + 1; j < this.asig.length; j++) {
        if (currentValue !== accessor(this.asig[j])) {
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


  Listado() {
    this.usuariosService.getusuarioscrite(this.idmodel).subscribe((data: UsuariosProjection[]) => {
      this.asig = data;
      console.log("usuarios:", JSON.stringify(this.asig))
      this.cacheSpan('id', (d) => d.id);
      this.cacheSpan('nombre', (d) => d.id + d.nombres);
      this.cacheSpan('usuario', (d) => d.id + d.nombres + d.usuario);
      this.cacheSpan('rol', (d) => d.id + d.nombres + d.usuario + d.rolnombre);
      this.cacheSpan('criterio', (d) => d.id + d.nombres + d.usuario + d.rolnombre);
      this.cacheSpan('actions', (d) => d.id + d.nombres + d.usuario + d.rolnombre + d.usuario);

    });
    this.isLoading = false;
  }

  openDialog(userrolid: any): void {
    this.criterioService.getcriteriousuario(userrolid, this.idmodel).subscribe((data: CriteUsuarioProjection[]) => {
      this.criterio = data;
      console.log("criterios.. " + JSON.stringify(this.criterio));

      // Crear el HTML para mostrar los criterios en el modal
      let modalContent = '<ul style="list-style-type: none; padding-left: 0;">'; // Eliminar estilos de viñeta
      if (this.criterio.length === 0) {
        modalContent += '<li>SIN CRITERIOS</li>';
      } else {
        this.criterio.forEach(criterio => {
          modalContent += `<li style="margin-left: -1em;">${criterio.criterionombre}</li>`; // Aplicar margen izquierdo negativo
        });
      }
      modalContent += '</ul>';

      // Mostrar el modal con los criterios
      Swal.fire({
        title: 'CRITERIOS',
        html: modalContent,
        confirmButtonText: 'Aceptar'
      });
    });
  }

}