import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ArchivoProjection } from 'src/app/interface/ArchivoProjection';
import { Modelo } from 'src/app/models/Modelo';
import { Usuario2 } from 'src/app/models/Usuario2';
import { ArchivoService } from 'src/app/services/archivo.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-email-responsables',
  templateUrl: './email-responsables.component.html',
  styleUrls: ['./email-responsables.component.css']
})
export class EmailResponsablesComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  idAdmin!: number;
  isLoading: boolean = false;
  usuarioResponsable: Usuario2[] = [];

  //
  searchTerm: string = '';
  correo: string = "";

  //tabla
  displayedColumns: string[] = ['file', 'uploadedBy', 'activity', 'startDate', 'endDate', 'sendMessage'];
  displayedColumns2: string[] = ['cedula', 'nombre', 'apellido', 'celular', 'direccion', 'sendMessage'];
  spanningColumns = ['uploadedBy', 'activity', 'startDate', 'endDate'];
  spans: any[] = [];
  itemsPerPageLabel = 'Archivos por página';
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
  fileInfos: Observable<any> | undefined;
  selectedFiles: FileList | undefined;
  sent: boolean = false;
  toUser: string = "";
  subject: string = "";
  message: string = "";
  personas!: any[];
  arch!: ArchivoProjection[];
  combinedRows: { resp: string, activid: string, rowspans: number }[] = [];
  modeloVigente!: Modelo;
  id_modelo!: number;

  constructor(public login: LoginService, private evidenciaService: EvidenciaService,
    private paginatorIntl: MatPaginatorIntl,
    private subiarchivo: ArchivoService,
    private emailService: EmailServiceService) { }

  ngOnInit(): void {
    this.modeloMax();
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.idAdmin = this.user.id;

    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.listaResponsable();

  }

  modeloMax() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
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

  mecorreo(coreo: any) {
    this.toUser = coreo;
  }

  listar() {
    console.log(this.arch)
    this.subiarchivo.getDatos().subscribe(
      (data: any) => {
        console.log(data);
        this.arch = data;
        //recorro y asigno las filas
        this.cacheSpan('uploadedBy', (y) => y.resp);
        this.cacheSpan('activity', (y) => y.resp + y.activid);
        this.cacheSpan('startDate', (y) => y.resp + y.activid + y.ini);
        this.cacheSpan('endDate', (y) => y.resp + y.activid + y.ini + y.finish);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  listaResponsable() {
    console.log('SI llego: ' + this.idAdmin);
    this.isLoading = true;
    this.evidenciaService
      .getlistadeResponsablesAdmin(this.idAdmin, this.id_modelo)
      .subscribe((data) => {
        const usuariosFiltrados = data.filter(
          (usuario, index, self) =>
            index === self.findIndex((u) => u.id === usuario.id)
        );
        this.usuarioResponsable = usuariosFiltrados;
        this.isLoading = false;
      });
  }

  notificar(id: any) {
    console.log("este es el id " + id);
  }

  enviar() {
    this.isLoading = true;
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
        this.isLoading = false;
      },
      error => {
        console.error('Error sending email:', error);
        // mostrar mensaje con swal
        swal.fire({
          icon: 'error',
          title: 'Error al enviar correo electrónico',
          text: 'No se pudo enviar el correo electrónico.'
        });
        this.isLoading = false;
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
