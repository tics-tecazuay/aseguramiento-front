import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AsignaComponent } from './asigna/asigna.component';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Historial_notifiComponent } from './historial_notifi/historial_notifi.component';
import { HistorialAsignacionEvComponent } from './historial-asignacion-ev/historial-asignacion-ev.component';
import { AsignacionCriterioResponsableComponent } from './asignacion-criterio-responsable/asignacion-criterio-responsable.component';
import { EvalucionComponent } from './evalucion/evalucion.component';

@NgModule({
  declarations: [
    DashboardComponent,
    EvalucionComponent,
    AsignaComponent,
    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    AprobarRechazarDetalleAdminComponent,
    Historial_notifiComponent,
    HistorialAsignacionEvComponent,
    AsignacionCriterioResponsableComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    SharedModule
  ]
})
export class AdminModule { }
