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
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Asignación",
      submenu: [
        { titulo: 'Asignar Evidencia', url: 'adm/asignaEvidencia', icono: 'fas fa-check-square' },
        { titulo: 'Historial Asignaciones', url: 'adm/historialAsigna', icono: 'fas fa-check-square' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Ver Criterios', url: 'adm/flujo-criterio-ad/criterioSuper', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión",
      submenu: [
        { titulo: 'Evaluar Evidencias', url: 'adm/evaluarevidencia', icono: 'fas fa-times-circle' },
        { titulo: 'Matriz de Evaluación', url: 'adm/calificar', icono: 'fas fa-times-circle' },
        { titulo: 'Estado Evidencias', url: 'adm/seguimientoevidencias', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-file-alt',
      titulo: "Reportes",
      submenu: [
        { titulo: 'Por Modelo', url: '/res/actividadCriterio', icono: 'fas fa-cubes' },
        { titulo: 'Por Criterio/s', url: 'adm/criterioreporte', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-bell',
      titulo: "Notificaciones",
      submenu: [
        { titulo: 'Ver Historial', url: 'adm/historialnotif', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fa fa-envelope',
      titulo: "E-mail",
      submenu: [
        { titulo: 'Enviar e-mail', url: 'adm/enviaremailadmin', icono: 'fas fa-check-square' }
      ]
    }
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
        { titulo: 'Historial de Acciones', url: 'sup/seguimiento', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Asignación",
      submenu: [
        { titulo: 'Asignar Evidencia', url: 'sup/responsables', icono: 'fas fa-cubes' }
      ]
    },

    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Ver Criterios', url: 'sup/flujo-criterio/criterioSuper', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' },
        { titulo: 'Responsables Criterios', url: 'sup/actividad_responsable', icono: 'fas fa-times-circle' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-cube',
      titulo: "Modelo",
      submenu: [
        { titulo: 'Ver Modelo/s', url: 'sup/modelo/modelo', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-superscript',
      titulo: "Fórmula",
      submenu: [
        { titulo: 'Ver Fórmulas', url: 'sup/formula/formula', icono: 'fas fa-cubes' },
        { titulo: 'Variables Cuantitativas', url: 'sup/formula/cuantitativa', icono: 'fas fa-cubes' },
        { titulo: 'Escalas Cualitativas', url: 'sup/formula/cualitativa', icono: 'fas fa-cubes' },
      ]
    },
    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión  ",
      submenu: [
        { titulo: 'Evaluar Evidencias', url: 'sup/aprobaciones', icono: 'fas fa-cubes' },
        { titulo: 'Estado Evidencias', url: 'sup/actividad-rechazada', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-bell',
      titulo: "Notificaciones",
      submenu: [
        { titulo: 'Historial ', url: 'adm/historialnotif', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fa fa-envelope',
      titulo: "E-mail",
      submenu: [
        { titulo: 'Enviar e-mail', url: 'sup/email', icono: 'fas fa-cubes' }
      ]
    }
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
      titulo: "Modelo",
      submenu: [
        { titulo: 'Ver modelos', url: 'res/modeloCriterio', icono: 'fas fa-file-contract' },
      ]
    }
  ]

  //LISTA DE ITEMS PARA SIDEBAR AUTORIDAD
  menu4: any[] = [
    {
      icono: 'nav-icon fas   fa-newspaper',
      titulo: "Dashboard",
      submenu: [
        { titulo: 'Ver Dashboard', url: 'aut/reporte', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas fa-file-alt',
      titulo: "Evidencias",
      submenu: [
        { titulo: 'Evidencias', url: 'aut/consulta', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-users',
      titulo: "Responsables",
      submenu: [
        { titulo: 'Lista de Responsables', url: 'aut/actividad_auto', icono: 'fas fa-cubes' }
      ]
    },
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
