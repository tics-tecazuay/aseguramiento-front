import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa/evaluacion-cuantitativa.component';
import { SubcriteriosIndicadorComponent } from './subcriterios-indicador/subcriterios-indicador.component';
import { IndicadoresEvidenciaComponent } from './indicadores-evidencia/indicadores-evidencia.component';
import { CriteriosSubcriterioComponent } from './criterios-subcriterio/criterios-subcriterio.component';
import { CriteriosComponent } from './criterios/criterios.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';

const routes: Routes = [
  {
    path: 'criterioSuper',
    component: CriteriosComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'criterios-subcriterio',
    component: CriteriosSubcriterioComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'indicador-evidencia',
    component: IndicadoresEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]

  }
  ,
  {
    path: 'subcriterios-indicador',
    component: SubcriteriosIndicadorComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  }
  ,
  {
    path: 'evaluacion-cuantitativa',
    component: EvaluacionCuantitativaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCriterioAdRoutingModule { }
