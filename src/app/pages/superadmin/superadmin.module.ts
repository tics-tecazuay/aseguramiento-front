
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';

import { DashboardComponent2 } from './pages/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { ObcervacionesComponent } from './pages/observaciones/obcervaciones.component';
import { CriterioReporteComponent } from './pages/criterio-reporte/criterio-reporte.component';
import { EvidenciaAtrasadaComponent } from './pages/evidencia-atrasada/evidencia-atrasada.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AprobacionactComponent } from './pages/aprobacionact/aprobacionact.component';
import { DetalleaprobComponent } from './pages/detalleaprob/detalleaprob.component';
import { SeguimientoUsuariosComponent } from './seguimiento-usuarios/seguimiento-usuarios.component';

@NgModule({
  declarations: [
    DashboardComponent2,
    CrearUsuariosComponent,
    ObcervacionesComponent,
    CriterioReporteComponent,
    EvidenciaAtrasadaComponent,
    AprobacionactComponent,
    DetalleaprobComponent,
    SeguimientoUsuariosComponent
  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule,
  ]
})
export class SuperadminModule { }
