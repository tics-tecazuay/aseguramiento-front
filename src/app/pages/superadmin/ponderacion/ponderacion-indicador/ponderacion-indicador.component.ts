import { Component, OnInit } from '@angular/core';
import { Ponderacion } from 'src/app/models/Ponderacion';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators ,FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Modelo } from 'src/app/models/Modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/models/Indicador';
import { Chart } from 'chart.js';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-ponderacion-indicador',
  templateUrl: './ponderacion-indicador.component.html',
  styleUrls: ['./ponderacion-indicador.component.css']
})
export class PonderacionIndicadorComponent implements OnInit{

  dataSource: any[] = [];
  ponderacionClase: Ponderacion=new Ponderacion();
  myForm: FormGroup;
  model: Modelo = new Modelo();
  asignacion: any;
  indicadorClase: Indicador=new Indicador();
  chart:any;
//trad
itemsPerPageLabel = 'Items por página';
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

  constructor(
    private servicePonderacion:PonderacionService,
    public fb:FormBuilder, private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private sharedDataService: SharedDataService,
    private modeloService:ModeloService,
    private asignacionIndicadorService: AsignacionIndicadorService,
    private indicadorservice: IndicadoresService
  ){
    this.myForm = fb.group({});
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
   }
  
  ngOnInit(): void {
  this.listarPonderacion();
  this.recibeModelo();
  this.recibeIndicador();
  }

  //Crear Ponderacion


  listarPonderacion(){
    this.servicePonderacion.listarPonderacion().subscribe(data => {
      this.dataSource = data;
    });
  }

 

 



 
  recibeModelo () {
    let id = localStorage.getItem("id");
    this.modeloService.getModeloById(Number(id)).subscribe(data => {
      this.model = data;
  })
 
  }

  recibeIndicador() {
    let id = localStorage.getItem("id");
    this.modeloService.getModeloById(Number(id)).subscribe(data => {
      this.model = data;
     
      this.indicadorservice.getIndicadorById(Number(id)).subscribe(data => {
        this.indicadorClase = data;
        console.log('Criterio  id :',this.indicadorClase);
      this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(id)).subscribe(info => {
        this.indicadorservice.getIndicadors().subscribe(result => {
          this.dataSource = [];
          this.asignacion = info;
          this.dataSource = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {

              const porcObtenido = indicador.porc_obtenido; // Obtener el valor del porc_obtenido del indicador
              if (porcObtenido <= 25) {
                indicador.color = 'rojo'; // Agregar una propiedad "color" al indicador y asignarle el valor 'verde'
              } else if(porcObtenido > 25 && porcObtenido <= 50){
                indicador.color = 'naranja'; // Agregar una propiedad "color" al indicador y asignarle el valor 'rojo'
              } else if(porcObtenido > 50 && porcObtenido <= 75){
                indicador.color = 'amarillo'; // Agregar una propiedad "color" al indicador y asignarle el valor 'rojo'
              }  else {
                indicador.color = 'verde'; // Agregar una propiedad "color" al indicador y asignarle el valor 'rojo'
              }
              return indicador.id_indicador === asignacion.indicador.id_indicador && indicador.subcriterio?.id_subcriterio === this.sharedDataService.obtenerIdSubCriterio();
              
               
            });
            
          });
          this.GraficaPastel();
         
       
        });
       
      });
      
  });
 
    });
  }

  GraficaPastel() {

  

    this.chart = new Chart("pastel", {
      type: 'pie',
      data: {
        labels: ['Menor o igual al 25%', 'Mayor al 25% y menor o igual al 50%', 'Mayor al 50% y menor al 75%', 'Mayor al 75%'],
        datasets: [
          {
            label: "Porcentaje de logro",
            data: [
              this.dataSource.filter((indicador:any) => indicador.porc_obtenido <= 25).length,
              this.dataSource.filter((indicador:any)  => indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50).length,
              this.dataSource.filter((indicador:any) => indicador.porc_obtenido > 50 && indicador.porc_obtenido < 75).length,
              this.dataSource.filter((indicador:any)  => indicador.porc_obtenido >= 75).length
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


 

}
