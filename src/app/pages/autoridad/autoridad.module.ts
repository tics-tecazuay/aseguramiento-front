import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoridadRoutingModule } from './autoridad-routing.module';
import { ReportesComponent } from './reportes/reportes.component';
import { ConsultaActividadComponent } from './consulta-actividad/consulta-actividad.component';
import { ActividadAutoridadComponent } from './actividad_autoridad/actividad-autoridad.component';
import { GraficosComponent } from './graficos/graficos.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReportesComponent,
    ConsultaActividadComponent,
    ActividadAutoridadComponent,
    GraficosComponent,
  ],
  imports: [
    CommonModule,
    AutoridadRoutingModule,
    SharedModule
  ]
})
export class AutoridadModule { }
