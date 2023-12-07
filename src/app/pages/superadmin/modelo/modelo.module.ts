import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeloRoutingModule } from './modelo-routing.module';
import { CustomDatePipe, InicioModeloComponent } from './inicio-modelo/inicio-modelo.component';
import { DialogoCriterioComponent } from './dialogo-criterio/dialogo-criterio.component';
import { DialogoSubcriterioComponent } from './dialogo-subcriterio/dialogo-subcriterio.component';
import { DetalleModeloComponent } from './detalle-modelo/detalle-modelo.component';
import { DialogoModeloComponent } from './dialogo-modelo/dialogo-modelo.component';
import { DetalleSubcriterioComponent } from './detalle-subcriterio/detalle-subcriterio.component';
import { DetalleIndicadorComponent } from './detalle-indicador/detalle-indicador.component';
import { MatrizEvaluacionComponent } from './matriz-evaluacion/matriz-evaluacion.component';
import { CalificacionComponent } from './matriz-evaluacion/calificacion/calificacion.component';
import { MatrizEvidenciasComponent } from './matriz-evaluacion/matriz-evidencias/matriz-evidencias.component';
import { AsignarCriterioComponent } from './detalle-modelo/asignar-criterio/asignar-criterio.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { DialogoModeloModComponent } from './dialogo-modelo-mod/dialogo-modelo-mod.component';

@NgModule({
  declarations: [
    InicioModeloComponent,
    DialogoCriterioComponent,
    DialogoSubcriterioComponent,
    DetalleModeloComponent,
    DialogoModeloComponent,
    DialogoModeloModComponent,
    DetalleSubcriterioComponent,
    DetalleIndicadorComponent,
    MatrizEvaluacionComponent,
    CalificacionComponent,
    MatrizEvidenciasComponent,
    AsignarCriterioComponent,
    CustomDatePipe,
  ],
  imports: [
    CommonModule,
    ModeloRoutingModule,
    
    SharedModule
  ]
})
export class ModeloModule { }
