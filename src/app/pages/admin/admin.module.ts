import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AsignaComponent } from './asigna/asigna.component';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Historial_notifiComponent } from './historial_notifi/historial_notifi.component';
import { HistorialAsignacionEvComponent } from './historial-asignacion-ev/historial-asignacion-ev.component';
//import { AsignacionCriterioResponsableComponent } from './asignacion-criterio-responsable/asignacion-criterio-responsable.component';
import { EvalucionComponent } from './evalucion/evalucion.component';
import { SeguimientoEvidenciasComponent } from './seguimiento-evidencias/seguimiento-evidencias.component';
import { CriterioReporteAdmComponent } from './criterio-reporte-adm/criterio-reporte-adm.component';
import { EmailResponsablesComponent } from './email-responsables/email-responsables.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CalificarIndicarComponent } from './calificar-indicar/calificar-indicar.component';


@NgModule({
  declarations: [
    DashboardComponent,
    EvalucionComponent,
    AsignaComponent,
    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    Historial_notifiComponent,
    HistorialAsignacionEvComponent,
    //AsignacionCriterioResponsableComponent,
    SeguimientoEvidenciasComponent,
    CriterioReporteAdmComponent,
    EmailResponsablesComponent,
    CalificarIndicarComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbTooltipModule,
    SharedModule
  ]
})
export class AdminModule { }
