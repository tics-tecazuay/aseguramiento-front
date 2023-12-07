import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    "username": '',
    "password": '',
  }
mision=false;
vision=false;
prin=false;
sobre=false;
sobre2=false;
sobre3=false;
  constructor(private _snack: MatSnackBar, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['user-dashboard']);
      location.replace('#/use/user-dashboard');
    }
  }
  abrir(){
    this.sobre= true
    this.mision=true;
  }
cerrar(){
  this.sobre= false;
  this.mision=false;
}
abrir2(){
  this.sobre2= true;
  this.vision=true;
}
cerrar2(){
  this.sobre2= false;
this.vision=false;
}
abrir3(){
  this.sobre3= true;
  this.prin=true;
}
cerrar3(){
  this.sobre3= false;
this.prin=false;
}
  formSubmit() {
    if (this.loginData.username.trim() == '' || this.loginData.username.trim() == null) {
      // this._snack.open('El username de usuario es requerido !!', 'Aceptar')
      Swal.fire(
        'Error',
        'El username de usuario es requerido !!',
        'warning'
      )
      return;
    }

    else if (this.loginData.password.trim() == '' || this.loginData.password.trim() == null) {
      // this._snack.open('La password es requerida !!', 'Aceptar')
      Swal.fire(
        'Error',
        'La password es requerida !!',
        'warning'
      )
      return;
    } else (

      this.loginService.generateToken(this.loginData).subscribe(
        (data: any) => {
          // console.log(data);
          this.loginService.loginUser(data.token);
          this.loginService.getCurrentUser().subscribe((user: any) => {
            this.loginService.setUser(user);
            // console.log(user);

            if (this.loginService.getUserRole() == 'ADMIN') {
              //dashboard admin
              //window.location.href = '/adm/admin';
              this.router.navigate(['user-dashboard']);
              location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'RESPONSABLE') {
              //user dashboard
              //window.location.href = '/use/user-dashboard';
              this.router.navigate(['user-dashboard']);
              location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'SUPERADMIN') {
              //user dashboard
              //window.location.href = '/use/user-dashboard';
              this.router.navigate(['dashboard']);
              location.replace('#/sup/dashboard');
              this.loginService.loginStatusSubjec.next(true);
              location.reload();
            }
            else if (this.loginService.getUserRole() == 'AUTORIDAD') {
              //user dashboard
              //window.location.href = '/use/user-dashboard';
              this.router.navigate(['user-dashboard']);
              location.replace('#/use/user-dashboard');
              this.loginService.loginStatusSubjec.next(true);
              window.location.reload();
            }
            else {
              this.loginService.logout();
              location.reload();
            }
          })
        }, (error) => {
          Swal.fire(
            'Error',
            'Detalles inválidos , vuelva a intentar !!',
            'warning'
          )
          // this.open_snackBar('Detalles inválidos , vuelva a intentar !!', 'Aceptar')ma
        }
      )
    )
  }
}
