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

  ocultar=false;
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
  nombre:string="";
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
    let id=history.state.criterio.idcriterio;
    this.nombre=history.state.criterio.nombrecriterio;
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
