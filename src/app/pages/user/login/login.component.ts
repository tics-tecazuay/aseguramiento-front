import { Rol } from 'src/app/models/Rol';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  isButtonDisabled= false;
  isLoading= false;

  constructor(private _snack: MatSnackBar, private loginService: LoginService, private router: Router, private usuarioRService : UsuariorolService, private fb: FormBuilder ) { 
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(10),noWhitespaceValidator]),
      rol: new FormControl(null, [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  
  ngOnInit(): void {
    this.formLogin.reset();
    if (this.loginService.isLoggedIn()) {
      // Obtener el rol del usuario
      const userRole = this.loginService.getUserRole();
  
      // Redirigir al usuario a su panel de control correspondiente según su rol
      switch (userRole) {
        case 'ADMIN':
        case 'SUPERADMIN':
        case 'RESPONSABLE':
        case 'AUTORIDAD':
          this.router.navigate(['/use/user-dashboard']);
          break;
        default:
          this.router.navigate(['/use/user-dashboard']);
          break;
      }
      
    }
    this.formLogin.get('username')?.valueChanges.subscribe((username) => {
      if(username.length == 10){
        this.listarRoles(username);
      }else{
        console.log('El username no debe contener espacios o estar vacio.');
      }
    });
    this.isButtonDisabled= false;
    this.isLoading= false;
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
  }

  formSubmit() {
    if(this.formLogin.invalid) {
      this._snack.open('Por favor, verifique los datos ingresados.', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.isLoading= false;
      this.isButtonDisabled= false;
      return;
    }else{
      this.isLoading= true;
      this.isButtonDisabled= true;
      this.loginService.generateToken(this.formLogin.value).subscribe(
        (data: any) => {
          this.loginService.loginUser(data.token);
          this.loginService.getCurrentUser().subscribe((user: any) => {
            this.loginService.setUser(user);
            this.loginService.setUserRole(this.selectedRoleValue);
            if (this.loginService.getUserRole() == 'ADMIN') {
              this.router.navigate(['/use/user-dashboard']);
              //location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              this.isLoading= false;
              this.isButtonDisabled= false;
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'RESPONSABLE') {
              this.router.navigate(['/res/dashboard']);
              //location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              this.isLoading= false;
              this.isButtonDisabled= false;
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'SUPERADMIN') {
              location.replace('#/sup/dashboard');
              this.loginService.loginStatusSubjec.next(true);
              this.isLoading= false;
              this.isButtonDisabled= false;
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'AUTORIDAD') {
              this.router.navigate(['/use/user-dashboard']);
              //location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              window.location.reload();
              this.isLoading= false;
              this.isButtonDisabled= false;
              location.reload();
            }
            else {
              this.loginService.logout();
              this.isLoading= false;
              this.isButtonDisabled= false;
              location.reload();
            }
        }) 
        }, (error) => {
          if (error.status === 401) {
           // Credenciales inválidas
           Swal.fire(
            'Credenciales Incorrectas',
            '¡Vuelva a intentarlo!',
            'warning'
        );
        } 
          this.isLoading= false;
          this.isButtonDisabled= false;
        }
      )
    }
  }
}

export function noWhitespaceValidator(control: AbstractControl): { [key: string]: any } | null {
  if (control.value && control.value.trim() === '') {
    return { 'whitespace': true };
  }
  return null;
}