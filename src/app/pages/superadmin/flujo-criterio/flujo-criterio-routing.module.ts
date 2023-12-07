import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa/evaluacion-cuantitativa.component';
import { SubcriteriosIndicadorComponent } from './subcriterios-indicador/subcriterios-indicador.component';
import { IndicadoresEvidenciaComponent } from './indicadores-evidencia/indicadores-evidencia.component';
import { CriteriosSubcriterioComponent } from './criterios-subcriterio/criterios-subcriterio.component';
import { CriteriosComponent } from './criterios/criterios.component';

const routes: Routes = [
  {
    path: 'criterioSuper',
    component: CriteriosComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'criterios-subcriterio',
    component: CriteriosSubcriterioComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'indicador-evidencia',
    component: IndicadoresEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]

  }
  ,
  {
    path: 'subcriterios-indicador',
    component: SubcriteriosIndicadorComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  }
  ,
  {
    path: 'evaluacion-cuantitativa',
    component: EvaluacionCuantitativaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCriterioRoutingModule { }
