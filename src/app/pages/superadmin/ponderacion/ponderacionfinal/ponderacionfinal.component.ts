import { Component, OnInit } from '@angular/core';
import { Modelo } from 'src/app/models/Modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import { Ponderacion } from 'src/app/models/Ponderacion';

@Component({
  selector: 'app-ponderacionfinal',
  templateUrl: './ponderacionfinal.component.html',
  styleUrls: ['./ponderacionfinal.component.css']
})
export class PonderacionfinalComponent implements  OnInit  {

  dataSource:any;
  modelo=new Modelo();
  ponderacion:any ;
  ponde=new Ponderacion();


   constructor( 
    private servicePonderacion:PonderacionService,
    private modeloService:ModeloService

    )
    {}
  ngOnInit(): void {
    this.listarPonderacion();
    console.log(this.listarPonderacion()+'ponde');
  }

  listarPonderacion() {
  

      this.servicePonderacion.listarPonderacion().subscribe(
        (data: Ponderacion[]) => {
          this.ponderacion = data;
          this.coloresTabla();
        },
        (error: any) => {
          console.error('Error al listar ponderacion:', error);
        }
      );
     
     
 
   
   
  }

  
  coloresTabla(){
    this.ponderacion.forEach((ponderacion: any) => {

      if (ponderacion.porc_obtenido > 75 && ponderacion.porc_obtenido <= 100) {
        ponderacion.color = 'verde'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (ponderacion.porc_obtenido > 50 && ponderacion.porc_obtenido <= 75) {
        ponderacion.color = 'amarillo'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (ponderacion.porc_obtenido > 25 && ponderacion.porc_obtenido <= 50) {
        ponderacion.color = 'naranja'; // Indicador con porcentaje mayor a 50% será de color verde
      } else if (ponderacion.porc_obtenido <= 25) {
        ponderacion.color = 'rojo'; // Indicador con porcentaje menor a 30% será de color rojo
      } else {
        ponderacion.color = ''; // No se asigna ningún color a los indicadores que no cumplen las condiciones anteriores
      }
    });
  }
 

}


