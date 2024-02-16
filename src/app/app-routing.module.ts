
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';


const routes: Routes = [

  
  
  { path: '', redirectTo: 'use/login', pathMatch: 'full' },

  //PATHS DE ADMINISTRADOR
  {
    path: 'adm',
    loadChildren: () => import("./pages/admin/admin.module").then(m => m.AdminModule)
  },
  

  //PATHS DE SUPERADMIN

  {
    path: 'sup',
    loadChildren: () => import("./pages/superadmin/superadmin.module").then(m => m.SuperadminModule)
  },
  

  
  
  //PATHS DE RESPONSABLE
  {
    path: 'res',
    loadChildren: () => import("./pages/responsable/responsable.module").then(m => m.ResponsableModule)
  },
  



  //PATHS DE AUTORIDAD
  {
    path: 'aut',
    loadChildren: () => import("./pages/autoridad/autoridad.module").then(m => m.AutoridadModule)
  },
  
  //Otros Paths
  {
    path: 'use',
    loadChildren: () => import("./pages/user/user.module").then(m => m.UserModule)
  },
  {
    path: 'pagenotfoud',
    component: PageNotFoundComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
