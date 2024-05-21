import { Component, OnInit, ViewChild } from '@angular/core';



import { Indicador } from 'src/app/models/Indicador';
import { Modelo } from 'src/app/models/Modelo';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Criterio } from 'src/app/models/Criterio';
import { CriteriosService } from 'src/app/services/criterios.service';
import { Chart } from 'chart.js';
import { Archivo } from 'src/app/models/Archivo';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import baserUrl from 'src/app/services/helper';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ponderacion-criterio',
  templateUrl: './ponderacion-criterio.component.html',
  styleUrls: ['./ponderacion-criterio.component.css']
})
export class PonderacionCriterioComponent implements OnInit {
  itemsPerPageLabel = 'Criterios por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';

  ocultar = false;
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
  nombre: string = "";
  model: Modelo = new Modelo();
  archivos: Archivo[] = [];
  critrioClase = new Criterio();
  asignacion: any;
  criterio: Criterio = new Criterio();
  modelo: Modelo = new Modelo();
  color: any
  chart: any;
  idndicadorseleccionado: number = 0;

  dataSource = new MatTableDataSource<any>;

  //columnasUsuario: string[] = ['id_indicador', 'nombre', 'peso', 'porc_valor', 'porc_utilidad', 'valor'];
  columnasUsuario: string[] = ['id_indicador', 'nombre', 'peso', 'porc_valor', 'porc_utilidad', 'valor', 'archivo'];


  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  tusDatosService: any;

  constructor(
    private indicadorservice: IndicadoresService,
    private router: Router, private fb: FormBuilder,
    public modeloService: ModeloService, private paginatorIntl: MatPaginatorIntl,
    public asignacionIndicadorService: AsignacionIndicadorService,
    private activatedRoute: ActivatedRoute


  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.dataSource = new MatTableDataSource<any>(); // Inicialización del dataSource
  }
  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator || null;


  }
  ngOnInit(): void {
    this.llenar_datasource();

  }

  llenar_datasource() {
    let id = history.state.criterio.idcriterio;
    this.nombre = history.state.criterio.nombrecriterio;
    this.modelo = history.state.modelo;
    const id_criterio = 1; // Reemplaza con el ID de criterio correcto
    const id_modelo = 2; // Reemplaza con el ID de modelo correcto
    this.indicadorservice.listarIndicadorPorCriterioModelo(id, this.modelo.id_modelo).subscribe(
      (data) => {
        const mappedData = data.map((indicador: any) => {
          return {
            ...indicador,
            enlace: `${baserUrl}/archivo/${indicador.id_indicador}.pdf` // Reemplaza 'URL_DEL_BACKEND' con la URL correcta de tu backend
          };
        });

        this.dataSource = new MatTableDataSource(mappedData); // Crear instancia de MatTableDataSource

        console.log(this.dataSource.data + 'criteriooooooo');

        this.coloresTabla();
        this.GraficaPastel();
      }
    );
  }

  coloresTabla() {
    this.dataSource.data.forEach((indicador: any) => {

      if (indicador.porc_obtenido > 75 && indicador.porc_obtenido <= 100) {
        indicador.color = 'verde'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porc_obtenido > 50 && indicador.porc_obtenido <= 75) {
        indicador.color = 'amarillo'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50) {
        indicador.color = 'naranja'; // Indicador con porcentaje mayor a 50% será de color verde
      } else if (indicador.porc_obtenido <= 25) {
        indicador.color = 'rojo'; // Indicador con porcentaje menor a 30% será de color rojo
      } else {
        indicador.color = ''; // No se asigna ningún color a los indicadores que no cumplen las condiciones anteriores
      }
    });
  }

  generarInformeTotal(): void {
    this.coloresTabla2();

    console.log('Datos después de aplicar coloresTabla2:', this.dataSource.data);

    const content = [];
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    content.push({ text: `Fecha de generación: ${fechaGeneracion}`, alignment: 'right' });
    content.push({ text: 'Reporte - Ponderación del Criterio', style: 'titulo' });
    content.push({ text: '\n' });

    content.push({ text: 'CRITERIO', style: 'subtitulo' });
    content.push({ text: '' + this.nombre });

    const headerStyle = {
      fillColor: '#72B6FF',
      bold: true,
      color: '#FFFFFF',
    };

    const tableBody = [];
    tableBody.push([
      { text: 'INDICADOR', style: headerStyle },
      { text: 'PESO', style: headerStyle },
      { text: '% OBTENIDO', style: headerStyle },
      { text: '% UTILIDAD', style: headerStyle },
      { text: 'VALOR OBTENIDO', style: headerStyle },
    ]);

    const criteriosUnicos = Array.from(new Set(this.dataSource.data.map(elemento => elemento.nombrecriterio)));
    criteriosUnicos.forEach(criterio => {
      const indicadoresCriterio = this.dataSource.data.filter(elemento => elemento.nombrecriterio === criterio);

      indicadoresCriterio.forEach((indicador, index) => {
        const rowStyle = (index % 2 === 0) ? { fillColor: '#F2F2F2' } : {};

        const valorColor = indicador.color || 'transparent';

        const rowData = [
          { text: indicador.nombre, style: rowStyle },
          { text: indicador.peso, style: rowStyle },
          { text: indicador.porc_obtenido.toFixed(2), fillColor: valorColor, style: rowStyle }, // Aplicar fillColor al % OBTENIDO
          { text: indicador.porc_utilida_obtenida.toFixed(2), style: rowStyle },
          { text: indicador.valor_obtenido.toFixed(4), style: rowStyle }
        ];

        tableBody.push(rowData);
      });
    });

    content.push({
      table: {
        headerRows: 1,
        body: tableBody,
      },
      style: 'tabla',
    });

    // Convertir los canvas a imágenes base64
    const pastelImg = this.convertCanvasToImage('pastel');
    // Convertir el canvas de la gráfica de pastel a imagen base64


    // Agregar la imagen de la gráfica de pastel al PDF y centrarla
    content.push({ text: '\n' });
    content.push({ text: 'Gráfica de pastel por Criterios', style: 'titulo' });
    if (pastelImg) {
      content.push({ image: pastelImg, width: 500, alignment: 'center' });
    }

    const footer = (currentPage: number, pageCount: number) => {
      return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' };
    };

    const styles = {
      titulo: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subtitulo: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tabla: {
        margin: [0, 10, 0, 10],
      },
    };

    const documentDefinition: any = {
      content,
      styles,
      pageOrientation: 'landscape',
      footer: footer,
    };

    pdfMake.createPdf(documentDefinition).download('ponderacion_de_criterio.pdf');
    this.coloresTabla();

  }

  // Método para convertir canvas a imagen base64
  convertCanvasToImage(id: string): string {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    return canvas.toDataURL('image/png');
  }

  coloresTabla2() {
    this.dataSource.data.forEach((indicador: any) => {

      if (indicador.porc_obtenido > 75 && indicador.porc_obtenido <= 100) {
        indicador.color = '#00FF00';
      }
      else if (indicador.porc_obtenido > 50 && indicador.porc_obtenido <= 75) {
        indicador.color = '#FFFF00';
      }
      else if (indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50) {
        indicador.color = '#FFA500';
      } else if (indicador.porc_obtenido <= 25) {
        indicador.color = '#FF0000';
      } else {
        indicador.color = '';
      }
    });
  }

  //GRAFICA PASTEL
  GraficaPastel() {
    this.chart = new Chart("pastel", {
      type: 'pie',
      data: {
        labels: ['Menor o igual al 25%', 'Mayor al 25% y menor o igual al 50%', 'Mayor al 50% y menor al 75%', 'Mayor al 75%'],
        datasets: [
          {
            label: "Porcentaje de logro",
            data: [
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido <= 25).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido > 50 && indicador.porc_obtenido < 75).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido >= 75).length
            ],
            backgroundColor: ['red', 'orange', 'yellow', 'green']
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }
  regresar() {
    this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.modelo } });
  }

  irinicio() {
    this.router.navigate(['/sup/modelo/modelo']);
  }


  recoverPdf(id: number) {

    this.indicadorservice.recoverPdfLink(id).subscribe(
      (data) => {
        this.recoverPdf;
        this.idndicadorseleccionado = id;

        this.indicadorservice.getarchivorecoverPdf(id).subscribe(
          (data) => {

            this.archivos = data;
            console.log(this.archivos);

          }
        );
      });

  }

}
