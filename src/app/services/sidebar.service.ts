import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //LISTA DE ITEMS PARA SIDEBAR ADMIN
  menu: any[] = [
    {
      icono: 'nav-icon fas   fa-newspaper',
      titulo: "Dashboard",
      submenu: [
        { titulo: 'Ver Dashboard', url: 'use/user-dashboard', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas fa-users',
      titulo: "Asignación",
      submenu: [
        { titulo: 'Asignar Evidencia', url: 'adm/asignaEvidencia', icono: 'fas fa-check-square' },
        { titulo: 'Historial', url: 'adm/historialAsigna', icono: 'fas fa-check-square' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Criterios', url: 'adm/flujo-criterio-ad/criterioSuper', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Notificaciones",
      submenu: [
        { titulo: 'Historial ', url: 'adm/historialnotif', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-file-alt',
      titulo: "Reportes",
      submenu: [
        { titulo: 'Ver reportes', url: '/res/actividadCriterio', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión  ",
      submenu: [
        { titulo: 'Evaluación Evidencias', url: 'adm/apruebaAdmin', icono: 'fas fa-times-circle' },
        { titulo: 'Seguimiento Evidencias', url: 'sup/actividad-rechazada', icono: 'fas fa-cubes' }
      ]
    },
  ]

  //LISTA DE ITEMS PARA SIDEBAR SUPERADMIN
  menu2: any[] = [
    {
      icono: 'nav-icon fas   fa-newspaper',
      titulo: "Dashboard",
      submenu: [
        { titulo: 'Ver Dashboard', url: 'sup/dashboard', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas   fa-users',
      titulo: "Usuarios",
      submenu: [
        { titulo: 'Lista de Usuarios', url: 'sup/usuarios', icono: 'fas fa-list-ul ' },
        { titulo: 'Seguimiento de Usuarios', url: 'sup/seguimiento', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Email/Asignación",
      submenu: [
        { titulo: ' Enviar e-mails ', url: 'sup/email', icono: 'fas fa-cubes' },
        { titulo: ' Asignar Responsables', url: 'sup/responsables', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Criterios', url: 'sup/flujo-criterio/criterioSuper', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    },

    // {
    //   icono: 'nav-icon fas fas fa-star',
    //   titulo: "Evaluación",
    //   submenu: [
    //     { titulo: 'Evaluación de Actividades', url: 'evidenciaSuper', icono: 'fas fa-cubes' }

    //   ]
    // },

    {
      icono: 'nav-icon fas fa-solid fa-cube',
      titulo: "Modelo",
      submenu: [
        { titulo: 'Modelos', url: 'sup/modelo/modelo', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-superscript',
      titulo: "Fórmula",
      submenu: [
        { titulo: 'Fórmulas', url: 'sup/formula/formula', icono: 'fas fa-cubes' },
        { titulo: 'Fórmulas Cuantitativas', url: 'sup/formula/cuantitativa', icono: 'fas fa-cubes' },
        { titulo: 'Fórmulas Cualitativas', url: 'sup/formula/cualitativa', icono: 'fas fa-cubes' },
      ]
    },
    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión  ",
      submenu: [
        { titulo: 'Responsables de Criterios', url: 'sup/actividad_responsable', icono: 'fas fa-times-circle' },
        { titulo: 'Evaluación Evidencias', url: 'sup/aprobaciones', icono: 'fas fa-cubes' },
        { titulo: 'Seguimiento Evidencias', url: 'sup/actividad-rechazada', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Notificaciones",
      submenu: [
        { titulo: 'Historial ', url: 'adm/historialnotif', icono: 'fas fa-cubes' }
      ]
    },
  ]


  //LISTA DE ITEMS PARA SIDEBAR RESPONSABLE
  menu3: any[] = [
    {
      icono: 'nav-icon fas   fa-newspaper',
      titulo: "Dashboard",
      submenu: [
        { titulo: 'Ver Dashboard', url: 'res/dashboard', icono: 'fas fa-file-contract' }
      ]
    },
    {
      icono: 'nav-icon fas fa-file-alt',
      titulo: "Evidencias",
      submenu: [
        { titulo: 'Evidencias asignadas', url: 'res/evidenasignada', icono: 'fas fa-file-contract' }
      ]
    },
    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "Modelos",
      submenu: [
        { titulo: 'Reporte Modelos', url: 'res/modeloCriterio', icono: 'fas fa-file-contract' },
      ]
    }
  ]

  //LISTA DE ITEMS PARA SIDEBAR AUTORIDAD
  menu4: any[] = [
    {
      icono: 'nav-icon fas fa-solid fa-running',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Actividades Completadas', url: 'aut/consulta', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Responsable",
      submenu: [
        { titulo: 'Responsables', url: 'aut/actividad_auto', icono: 'fas fa-cubes' }
      ]
    }
  ,
    {
      icono: 'nav-icon fas fa-file-pdf',
      titulo: "Reportes",
      submenu: [
        { titulo: 'Modelos', url: 'aut/graficosAutor', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    }
  ]
}
