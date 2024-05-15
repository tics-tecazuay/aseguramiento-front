import { Component, OnInit, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoModeloComponent } from '../dialogo-modelo/dialogo-modelo.component';
import { Router } from '@angular/router';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { DialogoModeloModComponent } from '../dialogo-modelo-mod/dialogo-modelo-mod.component';
import { MatSelectionListChange } from '@angular/material/list';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
  transform(value: any): string {
    const dateValue = new Date(value);
    return format(dateValue, 'dd-MM-yyyy');
  }
}

@Component({
  selector: 'app-inicio-modelo',
  templateUrl: './inicio-modelo.component.html',
  styleUrls: ['./inicio-modelo.component.css']
})
export class InicioModeloComponent implements OnInit {
  @ViewChild('modalseleccionarmodelo') modalSelectModelo!: TemplateRef<any>;
  mode = new Modelo();
  modeloVigente!: Modelo;
  modeloSeleccionado!: Modelo;
  asignacion: any;
  estado!: string;
  datasource: any[] = [];
  datasourcemodelosm: any[] = [];
  isLoading: boolean = false;
  seleccionado!: boolean;
  constructor(public dialog: MatDialog,
    private router: Router,
    private modeloService: ModeloService,
    private modalService: NgbModal

  ) {
    this.addRandomColors(); // Llama a esta función para asignar colores aleatorios

  }
  
  addRandomColors() {
    this.datasource.forEach((item, index) => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      item.color = randomColor;
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.seleccionado = false;
    this.listarModelos();
  }

  listarModelos() {
    this.modeloService.getModelosVista().subscribe(data => {
      this.datasource = data;
      console.log(data)
      this.isLoading = false;
      this.seleccionado = false;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogoModeloComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(result => {
      this.listarModelos();
    });

  }
  openDialogMod(item: any) {
    const dialogRef = this.dialog.open(DialogoModeloModComponent, {
      width: '50%',
      data: { item } // Envía el parámetro 'item' al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listarModelos();
    });
  }

  enviarModelo(modelo: Modelo): void {
    localStorage.setItem("id", modelo.id_modelo.toString());
    this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: modelo } });
  }
  eliminar(modelo: any) {
    Swal.fire({
      title: 'Estas seguro de eliminar el modelo "'+modelo.nombre+'"?',
      showDenyButton: true,
      confirmButtonText: 'Cancelar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (!result.isConfirmed) {
        this.modeloService.eliminarlogic(modelo.id_modelo).subscribe(
          (response) => {
            localStorage.removeItem("modelo");
            this.modeloService.getModeMaximo().subscribe((data: any) => {
              this.modeloVigente = data;
              localStorage.setItem("modelo", JSON.stringify(this.modeloVigente));
            });
            this.listarModelos()
            Swal.fire('Eliminado!', '', 'success')
          }
        );
      }
    })
  }

  actualizarEstadoAD(id_modelo: number, vnum: number) {
    if(vnum==0){
      this.estado='Desactivar'
    }else if(vnum==1){
      this.estado='Activar'
    }
    Swal.fire({
      title: 'Esta seguro de '+this.estado+' el modelo? ',
      html: `
      <div class="alert alert-warning alert-dismissible fade show small" role="alert" *ngIf="seleccionado==true">
      <strong>Recuerde:</strong> Esta acción activara el modelo para todos los usuarios del sistema.
  </div>
    `,
      showDenyButton: true,
      confirmButtonText: this.estado,
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed){
        this.modeloService.editarEstadoModeload(id_modelo, vnum).subscribe(
          (response) => {
            localStorage.removeItem("modelo");
            this.modeloService.getModeMaximo().subscribe((data: any) => {
              this.modeloVigente = data;
              localStorage.setItem("modelo", JSON.stringify(this.modeloVigente));
            });
            this.listarModelos()
            if(vnum==0){
              Swal.fire('Modelo desactivado correctamente', '', 'success')
            }else if(vnum==1){
              Swal.fire('Modelo activado correctamente', '', 'success')
            }
            
          }
        );
      }
     console.log(result);
    })
  }

  cargarModelos(id_modelo: number){
    this.modeloService.listarModeloExcepto(id_modelo).subscribe(data => {
      this.datasourcemodelosm = data;
    });
  }

  onSelectionChange(event: MatSelectionListChange) { 
    this.modeloSeleccionado = event.options[0].value;
    if (this.modeloSeleccionado) {
       console.log('LLego',this.modeloSeleccionado);
       this.seleccionado = true; 
    }
  }
  limpiarSeleccion(){
    this.seleccionado = false;
  }
}