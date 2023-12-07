import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormulasComponent } from './formulas/formulas.component';
import { CuantitativaComponent } from './cuantitativa/cuantitativa.component';
import { CuanlitativaComponent } from './cuanlitativa/cuanlitativa.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';

const routes: Routes = [
  {
    path: 'formula',
    component: FormulasComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'cuantitativa',
    component: CuantitativaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'cualitativa',
    component: CuanlitativaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulaRoutingModule { }
