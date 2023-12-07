import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PonderacionRoutingModule } from './ponderacion-routing.module';
import { PonderacionComponent } from './ponderacion/ponderacion.component';
import { PonderacionIndicadorComponent } from './ponderacion-indicador/ponderacion-indicador.component';
import { PonderacionCriterioComponent } from './ponderacion-criterio/ponderacion-criterio.component';
import { PonderacionModeloComponent } from './ponderacion-modelo/ponderacion-modelo.component';
import { PonderacionfinalComponent } from './ponderacionfinal/ponderacionfinal.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    
    PonderacionComponent,
    PonderacionIndicadorComponent,
    PonderacionCriterioComponent,
    PonderacionModeloComponent,
    PonderacionfinalComponent,
  ],
  imports: [
    CommonModule,
    PonderacionRoutingModule,
    SharedModule
  ]
})
export class PonderacionModule { }
