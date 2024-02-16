import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario2 } from 'src/app/models/Usuario2';
import { Persona2 } from 'src/app/models/Persona2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  idprueba: any;
  idpruebapersona: any;
//
  usuariosEditGuar = new Usuario2();
  usuarioForm: FormGroup;
  contraForm: FormGroup;
  constructor(public login: LoginService,
    private usuariosService: UsuarioService,
    private personaService: PersonaService
  ) { 
    this.usuarioForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      celular: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      direccion: new FormControl('', [Validators.required]),
      primer_nombre: new FormControl('', [Validators.required,]),
      primer_apellido: new FormControl('', [Validators.required]),

    });
    this.contraForm = new FormGroup({
      confirmPassword: new FormControl('', [Validators.required, this.validatePasswords.bind(this)])
    });
  }
  ngOnInit() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    this.rol = this.login.getUserRole();
  }

  validatePasswords(control: FormControl): { [s: string]: boolean } | null {
    const password = this.usuariosEditGuar.password;
    const confirmPassword = control.value;
    if (password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  Actualizar(usuariosdit: Usuario2) {
    console.log(usuariosdit)
    usuariosdit.id = this.user.id;
    console.log(usuariosdit)
    this.user.password = usuariosdit.password;
    Swal.fire({
      title: 'Esta seguro de cambiar su contraseña?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuariosService.actualizar(usuariosdit.id, usuariosdit)
          .subscribe((response: any) => {
            Swal.fire({
              title: 'La contraseña ha sido modificada con exito, sera enviado al login',
              confirmButtonText: 'Ok',
              icon: 'info',
            }).then((result) => {
              if (result.isConfirmed) {

                this.login.logout();
                location.replace('/use/login');
              }
            })
          });
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    })
  }


  edit(): void {
    this.usuariosEditGuar.persona = this.user.persona;
    this.usuarioForm = new FormGroup({
      id_usuario: new FormControl(this.user.id), // Campo de solo lectura
      id_persona: new FormControl(this.user?.persona?.id_persona), // Campo de solo lectura
      correo: new FormControl(this.user?.persona?.correo, [Validators.required, Validators.email]),
      celular: new FormControl(this.user?.persona?.celular, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      direccion: new FormControl(this.user?.persona?.direccion, [Validators.required]),
      primer_nombre: new FormControl(this.user?.persona?.primer_nombre, [Validators.required]),
      primer_apellido: new FormControl(this.user?.persona?.primer_apellido, [Validators.required])
  });
  this.idprueba = this.user.id;
  this.idpruebapersona = this.user?.persona?.id_persona;
  }

  Actualizardatos(usuariosdit: Usuario2) {
    const persona: Persona2 = this.usuarioForm.value;
    console.log(persona);
    persona.id_persona = usuariosdit?.persona?.id_persona;
    console.log(persona.id_persona);
    console.log(this.idprueba);
    Swal.fire({
      title: 'Esta seguro de modificar sus datos?',
      showCancelButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
      icon: 'info',
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.existencia(this.idprueba).subscribe((existencia: boolean) => {
          if (existencia == true) {
            // La persona no existe, realizar la creación
            this.personaService.createPersona(persona).subscribe((response: any) => {
              console.log(response);
              this.login.getCurrentUser().subscribe((user: any) => {
                Swal.fire(
                  'Operación exitosa!',
                  'La persona ha sido creada con éxito',
                  'success'
                );
                this.login.setUser(user);
                this.user = this.login.getUser();
              });
            });
            this.personaService.actualizarPersonaIdEnUsuario(this.idprueba, this.idpruebapersona).subscribe((usuarioResponse: any) => {
              console.log(usuarioResponse);
            });
          } else {
            // La persona ya existe, realizar la actualización
            this.personaService.actualizar(persona.id_persona, persona).subscribe((response: any) => {
              console.log(response);
              this.login.getCurrentUser().subscribe((user: any) => {
                Swal.fire(
                  'Operación exitosa!',
                  'Los datos han sido modificados con éxito',
                  'success'
                );
                this.login.setUser(user);
                this.user = this.login.getUser();
              });
            });
          }
        });
        /*this.personaService.actualizar(persona.id_persona, persona)
          .subscribe((response: any) => {
            console.log(response);
            this.login.getCurrentUser().subscribe((user: any) => {
              Swal.fire(
                'Operación exitosa!',
                'Los datos han sido modificados con exito',
                'success'
              )
              this.login.setUser(user);
              this.user = this.login.getUser();
            });
          })*/
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'info')
      }
    })


  }

}