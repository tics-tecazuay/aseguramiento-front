import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { DashboardComponent2 } from './pages/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { ObcervacionesComponent } from './pages/observaciones/obcervaciones.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { EvidenciaAtrasadaComponent } from './pages/evidencia-atrasada/evidencia-atrasada.component';
import { CriterioReporteComponent } from './pages/criterio-reporte/criterio-reporte.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { EvalucionComponent } from '../admin/evalucion/evalucion.component';
import { AprobacionactComponent } from './pages/aprobacionact/aprobacionact.component';
import { DetalleaprobComponent } from './pages/detalleaprob/detalleaprob.component';
import { SeguimientoUsuariosComponent } from './seguimiento-usuarios/seguimiento-usuarios.component';

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent2,
  pathMatch: 'full',
  canActivate: [SuperGuard]
}
  ,
{
  path: 'usuarios',
  component: CrearUsuariosComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

{

  path: 'email',
  component: ObcervacionesComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN'] }
},
{

  path: 'actividad-rechazada',
  component: EvidenciaAtrasadaComponent,
  pathMatch: 'full',
  //canActivate: [SuperGuard]
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

}
  ,
//Compartidas
{
  path: 'criterio_reporte',
  component: CriterioReporteComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN', 'AUTORIDAD'] }
},
{
  path: 'actividad_responsable',
  component: DashboardComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
},
{
  path: 'responsables',
  component: EvalucionComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN'] }
},
{
  path: 'aprobaciones',
  component: AprobacionactComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN'] }
},
{
  path: 'detalle',
  component: DetalleaprobComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN'] }
},
{
  path: 'seguimiento',
  component: SeguimientoUsuariosComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN'] }
},
{
  path: 'modelo',
  loadChildren: () => import("./modelo/modelo.module").then(m => m.ModeloModule)
},
{
  path: 'ponderacion',
  loadChildren: () => import("./ponderacion/ponderacion.module").then(m => m.PonderacionModule)
},
{
  path: 'flujo-criterio',
  loadChildren: () => import("./flujo-criterio/flujo-criterio.module").then(m => m.FlujoCriterioModule)
},
{
  path: 'formula',
  loadChildren: () => import("./formula/formula.module").then(m => m.FormulaModule)
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {

}
