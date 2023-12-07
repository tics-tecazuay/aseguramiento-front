import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { ActivatedRoute } from '@angular/router';

type ColumnNames = {
  [key: string]: string;
}

@Component({
  selector: 'app-matriz-evidencias',
  templateUrl: './matriz-evidencias.component.html',
  styleUrls: ['./matriz-evidencias.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MatrizEvidenciasComponent implements OnInit {
  public columnNames: ColumnNames = {
    descripcion: 'Descripción de la Evidencia'
  };

  dataSource: any;
  idIndicador: any;


  columnsToDisplay = ['descripcion'];
  columnsToDisplayWithExpand = ['rowNumber', ...this.columnsToDisplay];
  expandedElement: any;

  constructor(private evidenciasService: EvidenciaService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ListarEvidencias();

  }

  ListarEvidencias() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.idIndicador = params['indicador'];
      this.evidenciasService.getEvidenciaPorIndicador(this.idIndicador).subscribe(
        (data) => {
          this.dataSource = data;
          for (let i = 0; i < this.dataSource.length; i++) {
            this.dataSource[i].rowNumber = i + 1;
          }
        });
    });
  }


  mostrarEvidencias(element: any) {

  }

  regresar() {
    window.history.back();
  }
}

