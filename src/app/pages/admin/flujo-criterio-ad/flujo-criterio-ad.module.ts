import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlujoCriterioAdRoutingModule } from './flujo-criterio-ad-routing.module';
import { CriteriosComponent } from './criterios/criterios.component';
import { IndicadoresEvidenciaComponent } from './indicadores-evidencia/indicadores-evidencia.component';
import { CriteriosSubcriterioComponent } from './criterios-subcriterio/criterios-subcriterio.component';
import { SubcriteriosIndicadorComponent } from './subcriterios-indicador/subcriterios-indicador.component';
import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa/evaluacion-cuantitativa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CriteriosComponent,
    IndicadoresEvidenciaComponent,
    CriteriosSubcriterioComponent,
    SubcriteriosIndicadorComponent,
    EvaluacionCuantitativaComponent,

  ],
  imports: [
    CommonModule,
    FlujoCriterioAdRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class FlujoCriterioAdModule { }
