import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CriteriosAdminComponent } from './criterios-admin/criterios-admin.component';
import { SubcriteriosAdminComponent } from './subcriterios-admin/subcriterios-admin.component';
import { IncadoresAdminComponent } from './incadores-admin/incadores-admin.component';
import { EvalucionComponent } from './evalucion/evalucion.component';
import { AsignaComponent } from './asigna/asigna.component';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Historial_notifiComponent } from './historial_notifi/historial_notifi.component';
@NgModule({
  declarations: [
    DashboardComponent,
    CriteriosAdminComponent,
    SubcriteriosAdminComponent,
    IncadoresAdminComponent,
    EvalucionComponent,
    AsignaComponent,
    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    AprobarRechazarDetalleAdminComponent,
Historial_notifiComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    SharedModule
  ]
})
export class AdminModule { }
