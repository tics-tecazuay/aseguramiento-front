import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadesResponsableComponent } from './actividades-responsable/actividades-responsable.component';
import { EvidenciasResponComponent } from './evidencias/evidencias.component';
import { EvidenciaTareasAsginadasComponent } from './evidencia-tareas-asginadas/evidencia-tareas-asginadas.component';
import { ActividadCriterioModelo } from './actividad-criterio-modelo/actividad-criterio-modelo.component';
import { ActividadCriterioDetalle } from './actividad-criterio-detalle/actividad-criterio-detalle.component';
import { ActividadCriterioSubcriterio } from './atividad-criterio-subcriterio/atividad-criterio-subcriterio.component';
import { ActiviadDetalleIndicadorComponent } from './actividad-detalle-indicador/actividad-detalle-indicador.component';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CriterioResponsableComponent } from './criterio-responsable/criterio-responsable.component';
import { CriterioModeloResponsableComponent } from './criterio-modelo-responsable/criterio-modelo-responsable.component';
import { SubcriterioResponsableComponent } from './subcriterio-responsable/subcriterio-responsable.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE', 'SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'ActividadesResponsable',
    component: ActividadesResponsableComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE', 'SUPERADMIN', 'ADMIN'] }
  }
  ,
  {
    path: 'evidenciaResponsable',
    component: EvidenciasResponComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE', 'SUPERADMIN', 'ADMIN'] }
  },

  {
    path: 'evidenasignada',
    component: EvidenciaTareasAsginadasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE', 'SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'actividadCriterio',
    component: ActividadCriterioModelo,
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE','ADMIN'] }
  },

  {
    path: 'detalleC',
    component: ActividadCriterioDetalle,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE','ADMIN'] }
  },
  {
    path: 'modeloCriterio',
    component: CriterioModeloResponsableComponent,
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE'] }
  },
  {
    path: 'detalleCriterio',
    component: CriterioResponsableComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE'] }
  },
  {
    path: 'criterio-subcriterio',
    component: ActividadCriterioSubcriterio,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },
  {
    path: 'detalleSubcriterio',
    component: SubcriterioResponsableComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['RESPONSABLE'] }
  },
 {
    path: 'subcriterio-indicador',
    component: ActiviadDetalleIndicadorComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableRoutingModule { }
