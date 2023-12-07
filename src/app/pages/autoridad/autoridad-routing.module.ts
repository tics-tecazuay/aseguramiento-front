import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoridadGuardService } from 'src/app/services/Guards/autoridad.guard';
import { ConsultaActividadComponent } from './consulta-actividad/consulta-actividad.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ActividadAutoridadComponent } from './actividad_autoridad/actividad-autoridad.component';
import { GraficosComponent } from './graficos/graficos.component';

const routes: Routes = [
  {
    path: 'consulta',
    component: ConsultaActividadComponent,
    pathMatch: 'full',
    canActivate: [AutoridadGuardService]
  },
  {
    path: 'reporte',
    component: ReportesComponent,
    pathMatch: 'full',
    canActivate: [AutoridadGuardService]
  },
  {
    path: 'actividad_auto',
    component: ActividadAutoridadComponent,
    pathMatch: 'full',
    canActivate: [AutoridadGuardService]
  },
  {
    path: 'graficosAutor',
    component: GraficosComponent,
    pathMatch: 'full',
    canActivate: [AutoridadGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoridadRoutingModule { }
