import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';
import { EvalucionComponent } from './evalucion/evalucion.component';
import { AsignaComponent } from './asigna/asigna.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { Historial_notifiComponent } from './historial_notifi/historial_notifi.component';
import { HistorialAsignacionEvComponent } from './historial-asignacion-ev/historial-asignacion-ev.component';
import { SeguimientoEvidenciasComponent } from './seguimiento-evidencias/seguimiento-evidencias.component';
//import { AsignacionCriterioResponsableComponent } from './asignacion-criterio-responsable/asignacion-criterio-responsable.component';
import { CriterioReporteAdmComponent } from './criterio-reporte-adm/criterio-reporte-adm.component';
import { EmailResponsablesComponent } from './email-responsables/email-responsables.component';
import { CalificarIndicarComponent } from './calificar-indicar/calificar-indicar.component';


const routes: Routes = [
  {
    path: 'admin',
    component: DashboardComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'criterioreporte',
    component: CriterioReporteAdmComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'historialnotif',
    component: Historial_notifiComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'evaluacion',
    component: EvalucionComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'calificar',
    component: CalificarIndicarComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'asigna',
    component: AsignaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },

  {
    path: 'apruebaAdmin',
    component: AprobarRechazarAdminComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
  {
    path: 'asignaEvidencia',
    component: AsignacionEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]

  },
  {
    path: 'flujo-criterio-ad',
    loadChildren: () => import("./flujo-criterio-ad/flujo-criterio-ad.module").then(m => m.FlujoCriterioAdModule)
  },
  {
    path: 'historialAsigna',
    component: HistorialAsignacionEvComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
  {
    path: 'seguimientoevidencias',
    component: SeguimientoEvidenciasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
  {
    path: 'enviaremailadmin',
    component: EmailResponsablesComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
