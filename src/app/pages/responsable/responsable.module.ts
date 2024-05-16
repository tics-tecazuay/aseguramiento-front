
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsableRoutingModule } from './responsable-routing.module';
import { EvidenciasResponComponent } from './evidencias/evidencias.component';
import { ActividadesResponsableComponent } from './actividades-responsable/actividades-responsable.component';
import { EvidenciaTareasAsginadasComponent } from './evidencia-tareas-asginadas/evidencia-tareas-asginadas.component';
import { ActividadCriterioModelo } from './actividad-criterio-modelo/actividad-criterio-modelo.component';
import { ActividadCriterioDetalle } from './actividad-criterio-detalle/actividad-criterio-detalle.component';
import { ActividadCriterioSubcriterio } from './atividad-criterio-subcriterio/atividad-criterio-subcriterio.component';
import { ActiviadDetalleIndicadorComponent } from './actividad-detalle-indicador/actividad-detalle-indicador.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CriterioResponsableComponent } from './criterio-responsable/criterio-responsable.component';
import { CriterioModeloResponsableComponent } from './criterio-modelo-responsable/criterio-modelo-responsable.component';
import { SubcriterioResponsableComponent } from './subcriterio-responsable/subcriterio-responsable.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    EvidenciasResponComponent,
    ActividadesResponsableComponent,
    EvidenciaTareasAsginadasComponent,
    ActividadCriterioModelo,
    ActividadCriterioDetalle,
    ActividadCriterioSubcriterio,
    ActiviadDetalleIndicadorComponent,
    DashboardComponent,
    CriterioResponsableComponent,
    CriterioModeloResponsableComponent,
    SubcriterioResponsableComponent,
  ],
  imports: [
    CommonModule,
    ResponsableRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ResponsableModule { }
