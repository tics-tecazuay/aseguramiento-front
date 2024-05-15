import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css']
})
export class SiderbarComponent implements OnInit {
  menuItems?: any[];
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  ruta: any = null;
  activeSubmenuIndex: number = -1; // Indice del submenú activo, -1 si ninguno está activo

  /*menuItems?: any[];
  opcionActiva: any = null;
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  ruta: any = null;*/

  constructor(private sidebarService: SidebarService, private router: Router, public login: LoginService) {
    //this.cargar();
  }


  ngOnInit(): void {
    this.cargar();

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

  public logout() {
    localStorage.removeItem("eviden");
    this.login.logout();
    location.replace('#/use/login');
    location.reload();
  }


  cargar() {
    if (this.isLoggedIn == false) {

      this.isLoggedIn = this.login.isLoggedIn();

      if (this.isLoggedIn) {

        //this.user = this.login.getUser();
        this.rol = this.login.getUserRole();

        if (this.rol == 'ADMIN') {
          this.menuItems = this.sidebarService.menu;
          this.ruta = 'admin';
        }
        else if (this.rol == 'SUPERADMIN') {
          this.menuItems = this.sidebarService.menu2
          this.ruta = 'usuarios';
        }
        else if (this.rol == 'RESPONSABLE') {
          this.menuItems = this.sidebarService.menu3
          this.ruta = 'actividad';
        }
        else if (this.rol == 'AUTORIDAD') {
          this.menuItems = this.sidebarService.menu4
          this.ruta = 'consulta';
        }
        else {
        }
      } else {

      }

    }
  }


}