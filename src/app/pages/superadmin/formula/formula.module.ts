import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulaRoutingModule } from './formula-routing.module';
import { FormulasComponent } from './formulas/formulas.component';
import { CuanlitativaComponent } from './cuanlitativa/cuanlitativa.component';
import { CuantitativaComponent } from './cuantitativa/cuantitativa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CuantitativaComponent,
    CuanlitativaComponent,
    FormulasComponent,
  ],
  imports: [
    CommonModule,
    FormulaRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class FormulaModule { }
