import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PonderacionComponent } from './ponderacion/ponderacion.component';
import { PonderacionfinalComponent } from './ponderacionfinal/ponderacionfinal.component';
import { PonderacionIndicadorComponent } from './ponderacion-indicador/ponderacion-indicador.component';
import { PonderacionCriterioComponent } from './ponderacion-criterio/ponderacion-criterio.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { PonderacionModeloComponent } from './ponderacion-modelo/ponderacion-modelo.component';

const routes: Routes = [
  {
    path: 'ponderacion',
    component: PonderacionComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
  },
  {
    path: 'ponderacion-final',
    component: PonderacionfinalComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
  },
  {
    path: 'ponderacion-indicador',
    component: PonderacionIndicadorComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'ponderacion-criterio',
    component: PonderacionCriterioComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
  {
    path: 'ponderacion-modelo',
    component: PonderacionModeloComponent,
    pathMatch: 'full',
    //canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PonderacionRoutingModule { }
