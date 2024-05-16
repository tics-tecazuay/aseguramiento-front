import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { PersonaService } from 'src/app/services/persona.service';
import swal from 'sweetalert2';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-obcervaciones',
  templateUrl: './obcervaciones.component.html',
  styleUrls: ['./obcervaciones.component.css']
})
export class ObcervacionesComponent implements OnInit {
  
  isLoading: boolean = false;
  displayedColumns2: string[] = ['cedula', 'nombre', 'apellido', 'celular', 'direccion', 'sendMessage'];
  itemsPerPageLabel = 'Archivos por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  correo: string = "";
  sent: boolean = false;
  toUser: string = "";
  subject: string = "";
  message: string = "";
  personas!: any[];
  searchTerm: string = '';
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
  @ViewChild('modal') modal: any;

  constructor( private serviceper: PersonaService,
    private paginatorIntl: MatPaginatorIntl,
    private emailService: EmailServiceService) { }

  ngOnInit(): void {
    this.listarpersonas();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  mecorreo(coreo: any) {
    this.toUser = coreo;
  }
  
  listarpersonas() {
    this.serviceper.getPersonas().subscribe(
      (data: any) => {
        this.personas = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  enviar() {
    this.isLoading = true;
    this.emailService.sendEmail([this.toUser], this.subject, this.message).subscribe(
      response => {
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
  
  closeModal() {
    this.modal.nativeElement.style.display = 'none';
  }
}
