import { Component, OnInit,ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { ArchivoService } from 'src/app/services/archivo.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaService } from 'src/app/services/persona.service';

import swal from 'sweetalert2';
import { Archivo } from 'src/app/models/Archivo';
import { ArchivoProjection } from 'src/app/interface/ArchivoProjection';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-obcervaciones',
  templateUrl: './obcervaciones.component.html',
  styleUrls: ['./obcervaciones.component.css']
})
export class ObcervacionesComponent implements OnInit {
//tabla
  displayedColumns: string[] = ['file', 'uploadedBy', 'activity', 'startDate', 'endDate', 'sendMessage'];
  displayedColumns2: string[] = ['cedula', 'nombre', 'apellido', 'celular', 'direccion', 'sendMessage'];
  spanningColumns = ['uploadedBy', 'activity', 'startDate', 'endDate'];
  spans: any[] = [];
  itemsPerPageLabel = 'Archivos por página';
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
  fileInfos: Observable<any> | undefined;
  selectedFiles: FileList | undefined;
  sent: boolean = false;
  toUser: string = "";
  subject: string = "";
  message: string = "";
  personas!: any[];
  arch!: ArchivoProjection[];
  combinedRows: { resp: string, activid: string, rowspans: number }[] = [];

  constructor(private archivo: ArchivoService,
    private _snackBar: MatSnackBar,private serviceper:PersonaService,
    private paginatorIntl: MatPaginatorIntl,
    private subiarchivo:ArchivoService,
    private emailService: EmailServiceService) { }
  ngOnInit(): void {
    this.listarpersonas();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  //Contador para combinar celdas
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.arch.length;) {
      let currentValue = accessor(this.arch[i]);
      let count = 1;

      for (let j = i + 1; j < this.arch.length; j++) {
        if (currentValue !== accessor(this.arch[j])) {
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
  //
  searchTerm: string = '';
correo:string ="";

mecorreo(coreo:any){
  
this.toUser=coreo;
}
  listar() {
    console.log(this.arch)
    this.subiarchivo.getDatos().subscribe(
      (data: any) => {
        console.log(data);
        this.arch = data;
        //recorro y asigno las filas
        this.cacheSpan('uploadedBy', (y) => y.resp);
        this.cacheSpan('activity', (y) => y.resp+y.activid);
        this.cacheSpan('startDate', (y) => y.resp+y.activid+y.ini);
        this.cacheSpan('endDate', (y) => y.resp+y.activid+y.ini+y.finish);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  listarpersonas() {
    
    this.serviceper.getPersonas().subscribe(
      (data: any) => {
        console.log(JSON.stringify(data));
        this.personas = data;
        console.log("lista "+this.personas);
        
      },
      (error) => {
        console.error(error);
      }
    );
  }

notificar(id:any){
  console.log("este es el id "+id);
}
  enviar() {
    this.emailService.sendEmail([this.toUser], this.subject, this.message).subscribe(
      response => {
        console.log('Email sent successfully!');
        // mostrar mensaje con swal
        swal.fire({
          icon: 'success',
          title: '¡Correo electrónico enviado!',
          text: 'El correo electrónico se envió correctamente.'
        });
        this.limpiarCampos();
      },
      error => {
        console.error('Error sending email:', error);
        // mostrar mensaje con swal
        swal.fire({
          icon: 'error',
          title: 'Error al enviar correo electrónico',
          text: 'No se pudo enviar el correo electrónico.'
        });
      }
    );
  }

limpiarCampos() {
  this.toUser = '';
  this.subject = '';
  this.message = '';
}
@ViewChild('modal') modal: any;

closeModal() {
  this.modal.nativeElement.style.display = 'none';
}
}
