import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';


const routes: Routes = [
  
      { path: '', redirectTo: 'use/login', pathMatch: 'full' },
      // Paths de ADMINISTRADOR
      { path: 'adm', loadChildren: () => import("./pages/admin/admin.module").then(m => m.AdminModule) },
      // Paths de SUPERADMIN
      { path: 'sup', loadChildren: () => import("./pages/superadmin/superadmin.module").then(m => m.SuperadminModule) },
      // Paths de RESPONSABLE
      { path: 'res', loadChildren: () => import("./pages/responsable/responsable.module").then(m => m.ResponsableModule) },
      // Paths de AUTORIDAD
      { path: 'aut', loadChildren: () => import("./pages/autoridad/autoridad.module").then(m => m.AutoridadModule) },
      // Otros Paths
      { path: 'use', loadChildren: () => import("./pages/user/user.module").then(m => m.UserModule) },
      
      { path: 'pagenotfound', component: PageNotFoundComponent },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }