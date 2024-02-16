import { Component, ViewChild } from '@angular/core';
import { SeguimientoUsuarioProjection } from 'src/app/interface/SeguimientoUsuarioProjection';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-seguimiento-usuarios',
  templateUrl: './seguimiento-usuarios.component.html',
  styleUrls: ['./seguimiento-usuarios.component.css']
})
export class SeguimientoUsuariosComponent {
  userss: SeguimientoUsuarioProjection[] = [];
  displayedColumns: string[] = ['username', 'rolnombre', 'usuario', 'descripcion', 'fecha'];
  dataSource = new MatTableDataSource<SeguimientoUsuarioProjection>();
  ocultar = false;
  filterPost = '';

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private userServ: UsuarioService, public login: LoginService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: SeguimientoUsuarioProjection, filter: string) => {
      const searchTerms = filter.split(' '); // Divide el filtro en términos individuales
      return searchTerms.every(term =>
        data.id_seguimiento.toString().includes(term) ||
        data.fecha.toString().includes(term) || // Convierte la fecha a cadena
        data.descripcion.toLowerCase().includes(term)
      );
    };
    this.Listado();
  }

  Listado() {
    this.userServ.listSeguiminetoUsers().subscribe(
      (data: SeguimientoUsuarioProjection[]) => {
        console.log("Datos recibidos ", JSON.stringify(data));
        this.userss = data;
        this.dataSource.data = data; // Asigna los datos a la fuente de datos de la tabla
      },
      (error) => {
        console.error("Error al obtener datos del servicio:", error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.filter = lowerCaseFilter;
    } else {
      // Restaurar los datos originales si no hay filtro aplicado
      this.dataSource.filter = '';
    }
  }
  
}