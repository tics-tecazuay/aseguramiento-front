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
  formulario: FormGroup;
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
  constructor(private _snack: MatSnackBar, private loginService: LoginService, private formBuilder: FormBuilder, private router: Router, private usuarioRService : UsuariorolService) { 
    this.formulario = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.selectedRoleValue = undefined;
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
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
      this.roles = data;
      console.log(this.roles);
    }
  )
  }

  onChangeRole(event: any) {
    this.selectedRoleValue = event.target.value;
    console.log('Rol seleccionado:', this.selectedRoleValue);
  }

  formSubmit() {
    
    if (this.loginData.username.trim() == '' || this.loginData.username.trim() == null) {

      Swal.fire(
        'Error',
        'El username de usuario es requerido !!',
        'warning'
      )
      return;
    } else if (this.loginData.password.trim() == '' || this.loginData.password.trim() == null) {

      Swal.fire(
        'Error',
        'La password es requerida !!',
        'warning'
      )
      return;
    } else (
 // Acceder al valor seleccionado en el combobox de roles
      this.loginService.generateToken(this.loginData).subscribe(
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
    )
  }
  validateRol(control: FormControl) {
    const selectedRol = control.value;
    if (!selectedRol || selectedRol === 0) {
      return {
        required: true
      };
    }
    return null;
  }
  validateUsernameLength() {
    this.listarRoles(this.loginData.username);
    const usernameControl = this.formulario.get('username');
    if (usernameControl && usernameControl.value.length !== 10) {
      usernameControl.setErrors({ 'invalidLength': true });
    } else {
      // usernameControl.setErrors(null);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    this.loginData.username = pastedText.trim();
  }
}
