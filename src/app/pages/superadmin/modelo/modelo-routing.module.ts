import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { DetalleModeloComponent } from './detalle-modelo/detalle-modelo.component';
import { InicioModeloComponent } from './inicio-modelo/inicio-modelo.component';
import { DetalleIndicadorComponent } from './detalle-indicador/detalle-indicador.component';
import { DetalleSubcriterioComponent } from './detalle-subcriterio/detalle-subcriterio.component';
import { MatrizEvaluacionComponent } from './matriz-evaluacion/matriz-evaluacion.component';
import { MatrizEvidenciasComponent } from './matriz-evaluacion/matriz-evidencias/matriz-evidencias.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';

const routes: Routes = [
  {
    path: 'detalle-subcriterio',
    component: DetalleSubcriterioComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
  },
  {
    path: 'detalle-indicador',
    component: DetalleIndicadorComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
  },
  

  {
    path: 'modelo',
    component: InicioModeloComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
  {
    path: 'detallemodelo',
    component: DetalleModeloComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'matriz-evaluacion',
    component: MatrizEvaluacionComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'matriz-evidencias',
    component: MatrizEvidenciasComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeloRoutingModule { }
