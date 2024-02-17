import { Rol } from 'src/app/models/Rol';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuariorolService } from 'src/app/services/usuariorol.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  selectedRoleValue!: any;
  roles: Rol[] = [];
  loginData = {
    "username": '',
    "password": '',
  }
  mision = false;
  vision = false;
  prin = false;
  sobre = false;
  sobre2 = false;
  sobre3 = false;
  constructor(private _snack: MatSnackBar, private loginService: LoginService, private router: Router, private usuarioRService : UsuariorolService, private fb: FormBuilder ) { 
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(10)]),
      rol: new FormControl(null, [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  
  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.selectedRoleValue = undefined;
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.formLogin.get('username')?.valueChanges.subscribe((username) => {
        this.listarRoles(username);
    });
  }

  abrir() {
    this.sobre = true
    this.mision = true;
  }
  cerrar() {
    this.sobre = false;
    this.mision = false;
  }
  abrir2() {
    this.sobre2 = true;
    this.vision = true;
  }
  cerrar2() {
    this.sobre2 = false;
    this.vision = false;
  }
  abrir3() {
    this.sobre3 = true;
    this.prin = true;
  }
  cerrar3() {
    this.sobre3 = false;
    this.prin = false;
  }
  
  listarRoles(username: string) {
    this.usuarioRService.getRolesPorUsername(username).subscribe(
      (data: Rol[]) => {
        if(data.length === 0) {
          this.roles = [{rolId: 0, rolNombre: 'No hay roles disponibles para este usuario.' }];
        } else {
          this.roles = data;
        }
      }
    );
  }
  

  onChangeRole(event: any) {
    this.selectedRoleValue = event.value;
    console.log('Rol seleccionado:', this.selectedRoleValue);
    console.log('Rol seleccionado form group', this.formLogin.value.rol);
  }

  formSubmit() {
    if(this.selectedRoleValue.rolId === 0) {
      this._snack.open('No hay roles disponibles para este usuario.', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    console.log(this.formLogin.value);
    console.log(this.selectedRoleValue);
      this.loginService.generateToken(this.formLogin.value).subscribe(
        (data: any) => {
          console.log(data);
          this.loginService.loginUser(data.token);
          this.loginService.getCurrentUser().subscribe((user: any) => {
            this.loginService.setUser(user);
            console.log(user);

            if (this.selectedRoleValue == 'ADMIN') {
              this.router.navigate(['user-dashboard']);
              location.replace('/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
            }
            else if (this.selectedRoleValue == 'RESPONSABLE') {

              this.router.navigate(['user-dashboard']);
              location.replace('/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
            }
            else if (this.selectedRoleValue == 'SUPERADMIN') {

              this.router.navigate(['dashboard']);
              location.replace('/sup/dashboard');
              this.loginService.loginStatusSubjec.next(true);
            }
            else if (this.selectedRoleValue == 'AUTORIDAD') {

              this.router.navigate(['user-dashboard']);
              location.replace('/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              window.location.reload();
            }
            else {
              this.loginService.logout();
            }
          })
        }, (error) => {
          Swal.fire(
            'Error',
            'Detalles inválidos , vuelva a intentar !!',
            'warning'
          )
        }
      )
  }
}
