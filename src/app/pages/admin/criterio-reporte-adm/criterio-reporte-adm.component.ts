import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Criterio } from 'src/app/models/Criterio';
import { Indicador } from 'src/app/models/Indicador';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { LoginService } from 'src/app/services/login.service';
import { CriterioByAdmin } from 'src/app/interface/CriteUsuarioProjection';
import { Observable, catchError, map, mapTo, of } from 'rxjs';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { Modelo } from 'src/app/models/Modelo';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-criterio-reporte-adm',
  templateUrl: './criterio-reporte-adm.component.html',
  styleUrls: ['./criterio-reporte-adm.component.css']
})
export class CriterioReporteAdmComponent {
  criteriosCuali: any[] = [];
  criteriosCuanti: any[] = [];

  isLoggedIn = false;
  user: any = null;
  rango: any = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
  //
  mostrarVistaGeneral: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  modoVisualizacion: 'cualitativo' | 'cuantitativo' = 'cualitativo'; // Inicialmente, muestra los datos cualitativos
  modoVista: 'general' | 'cualitativo' | 'cuantitativo' = 'general'; // Inicialmente, muestra la vista general
  searchText = '';
  modeloVigente!: Modelo;

  constructor(
    private indicadorservice: IndicadoresService,
    private criterioservice: CriteriosService,
    private loginservice: LoginService
  ) {
  }
  ngOnInit() {

    this.isLoggedIn = this.loginservice.isLoggedIn();
    this.user = this.loginservice.getUser();
    this.loginservice.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.loginservice.isLoggedIn();
      this.user = this.loginservice.getUser();
    });
    this.obtenerModeloVigente();
    this.listarcriterio().subscribe(() => {
      // Llamamos al método que necesita this.criterios después de cargarlos
      this.listar();
      this.listarpruebasalvCL();
      this.listarpruebasalvCT();
    });


  }

  buscar = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public indic = new Indicador();
  indicadors: any[] = [];
  criterios: any[] = [];
  idsCriterios: any[] = [];
  listarcriterioExecuted = false;

  obtenerModeloVigente() { 
  this.modeloVigente=JSON.parse(localStorage.getItem('modelo') || '{}');
  }

  listar(): void {
    this.criterioservice.getCriteriosByAdminUltimateModel(this.user.id).subscribe(
      (criterios: CriterioByAdmin[]) => {
        const idsCriterios = criterios.map(criterio => criterio.id_criterio);
        this.indicadorservice.indicadoresPorCriterios(this.modeloVigente.id_modelo,idsCriterios).subscribe(
          (data: IndicadorProjection[]) => {
            this.indicadors = data;
            this.listarcriterio();
            //this.listarcriterioExecuted = true;
          },
          (error: any) => {
            console.error('Error al listar los indicadors:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al listar los criterios:', error);
      }
    );
  }

  listaprincipalcuantitativos(): void {
    this.criterioservice.getCriteriosByAdminUltimateModel(this.user.id).subscribe(
      (criterios: CriterioByAdmin[]) => {
        const idsCriterios = criterios.map(criterio => criterio.id_criterio);
        this.indicadorservice.indicadoresPorCriteriosPruebaAlvCT(idsCriterios,this.modeloVigente.id_modelo).subscribe(
          (datacuanti: IndicadorProjection[]) => {
            this.criteriosCuanti = datacuanti;
            this.listarcriterio();
          },
          (error: any) => {
            console.error('Error al listar los indicadores:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al listar los criterios:', error);
      }
    );
  }


  listaprincipalcualitativos(): void {
    this.criterioservice.getCriteriosByAdminUltimateModel(this.user.id).subscribe(
      (criterios: CriterioByAdmin[]) => {
        const idsCriterios = criterios.map(criterio => criterio.id_criterio);
        this.indicadorservice.indicadoresPorCriteriosPruebaAlvCL(idsCriterios, this.modeloVigente.id_modelo).subscribe(
          (datacuali: IndicadorProjection[]) => {
            this.criteriosCuali = datacuali;
            this.listarcriterio();
          },
          (error: any) => {
            console.error('Error al listar los indicadores:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al listar los criterios:', error);
      }
    );
  }


  listarpruebasalvCL(): void {
    if (this.criteriosSeleccionados.length === 0) {
      this.listaprincipalcualitativos();
    } else {
      const idsCriteriosSeleccionados = this.criteriosSeleccionados.map(criterio => criterio.id_criterio);
      this.indicadorservice.indicadoresPorCriteriosPruebaAlvCL(idsCriteriosSeleccionados, this.modeloVigente.id_modelo).subscribe(
        (datacuali: IndicadorProjection[]) => {
          this.criteriosCuali = datacuali;
          this.listarcriterio();
        },
        (error: any) => {
          console.error('Error al listar los indicadores:', error);
        }
      );
    }
  }

  listarpruebasalvCT(): void {
    if (this.criteriosSeleccionados.length === 0) {
      this.listaprincipalcuantitativos();
    } else {
      const idsCriterios = this.criteriosSeleccionados.map((criterio) => criterio.id_criterio);

      this.indicadorservice.indicadoresPorCriteriosPruebaAlvCT(idsCriterios,this.modeloVigente.id_modelo).subscribe(
        (datacuanti: IndicadorProjection[]) => {
          this.criteriosCuanti = datacuanti;
          this.listarcriterio();
        },
        (error: any) => {
          console.error('Error al listar los indicadores:', error);
        }
      );
    }
  }


  listarcriterio(): Observable<void> {
    return this.criterioservice.getCriteriosByAdminUltimateModel(this.user.id).pipe(
      map((data: CriterioByAdmin[]) => {
        this.criterios = data;
        this.idsCriterios = this.criterios.map(criterio => criterio.id_criterio);
      }),
      catchError(error => {
        console.error('Error al cargar los criterios:', error);
        return of(null); // Retornamos un observable con null en caso de error
      }),
      map(() => void 0) // Transformamos el valor a void para asegurarnos de que el observable solo emita void
    );
  }
  public criteriosSeleccionados: CriterioByAdmin[] = [];

  toggleCriterioSelection(criterio: CriterioByAdmin) {
    if (this.isCriterioSelected(criterio)) {
      this.criteriosSeleccionados = this.criteriosSeleccionados.filter((c) => c.id_criterio !== criterio.id_criterio);
    } else {
      this.criteriosSeleccionados.push(criterio);
    }
  }

  activarVistaGeneral() {
    this.mostrarVistaGeneral = true;
    this.listar(); // Llama al método listar para cargar todos los datos
  }
  toggleModoVisualizacion() {
    // Cambia entre 'cualitativo' y 'cuantitativo'
    this.modoVisualizacion = this.modoVisualizacion === 'cualitativo' ? 'cuantitativo' : 'cualitativo';
    this.listarpruebasalvCL();
    this.listarpruebasalvCT();
  }
  isCriterioSelected(criterio: CriterioByAdmin) {
    return this.criteriosSeleccionados.some((c) => c.id_criterio === criterio.id_criterio);
  }
  public buscarPorCriterio(): void {
    if (this.criteriosSeleccionados.length === 0) {
      this.listar();
    } else {
      const idsCriterios = this.criteriosSeleccionados.map((criterio) => criterio.id_criterio);
      this.indicadorservice.indicadoresPorCriterios(this.modeloVigente.id_modelo,idsCriterios).subscribe(
        (data: IndicadorProjection[]) => {
          this.indicadors = data;
        },
        (error: any) => {
          console.error('Error al buscar los indicadores por criterio:', error);
        }
      );
    }
  }
  tablaExpandida: 'tablaGeneral' | 'tablaCualitativa' | 'tablaCuantitativa' = 'tablaGeneral';

  alternarTabla(tabla: 'tablaGeneral' | 'tablaCualitativa' | 'tablaCuantitativa') {
    this.tablaExpandida = tabla;
  }
  generarInformeTotal(): void {
    const content = [];
    // Agrega la fecha de generación del PDF
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    content.push({ text: `Fecha de generación: ${fechaGeneracion}`, alignment: 'right' });

    // Agrega el título
    content.push({ text: 'Reporte por Criterio', style: 'titulo' });
    content.push({ text: '\n' });

    // Crea la tabla de datos
    const tableData = [];

    // Estilo para las cabeceras de la tabla
    const headerStyle = {
      fillColor: '#72B6FF', // Color de fondo
      bold: true, // Negrita
      color: '#FFFFFF', // Color de texto
    };
    const criteriosUnicos = Array.from(
      new Set(this.indicadors.map((indicador) => indicador.nombrecriterio))
    );
    criteriosUnicos.forEach((criterio) => {
      const indicadoresCriterio = this.indicadors.filter(
        (indicador) => indicador.nombrecriterio === criterio
      );

      // Genera la tabla para el criterio actual
      const tableDataCriterio = [];
      tableDataCriterio.push([
        { text: 'SUBCRITERIO', style: headerStyle },
        { text: 'INDICADOR', style: headerStyle },
        { text: 'DESCRIPCIÓN', style: headerStyle },
        { text: 'VALOR OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE UTILIDAD', style: headerStyle },
      ]);

      indicadoresCriterio.forEach((indicador, index) => {
        const rowStyle = index % 2 === 0 ? { fillColor: '#F2F2F2' } : {}; // Colores intercalados

        tableDataCriterio.push([
          { text: indicador.nombresubcriterio, style: rowStyle },
          { text: indicador.nombreindicador, style: rowStyle },
          { text: indicador.descripcionindicador, style: rowStyle },
          { text: indicador.valorobtenido, style: rowStyle },
          { text: indicador.porcentajeobtenido, style: rowStyle },
          { text: indicador.porcentajeutilidad, style: rowStyle },

        ]);
      });

      // Agrega la tabla al contenido del informe
      content.push({
        text: ' - Criterio: ' + criterio,
        style: 'subtitulo',
      });
      content.push({
        table: {
          headerRows: 1,
          body: tableDataCriterio,
        },
        style: 'tabla',
      });
    });
    const footer = function (currentPage: number, pageCount: number) {
      return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' };
    };

    const styles = {
      titulo: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subtitulo: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tabla: {
        margin: [0, 10, 0, 10],
      },
    };

    // Crea el documento PDF
    const documentDefinition: any = {
      content,
      styles,
      pageOrientation: 'landscape',
    };

    // Genera el PDF y descárgalo
    pdfMake.createPdf(documentDefinition).download('informe.pdf');
  }



  generarInforme(): void {
    const content = [];
    // Agrega la fecha de generación del PDF
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    content.push({ text: `Fecha de generación: ${fechaGeneracion}`, alignment: 'right' });

    // Agrega el título
    content.push({ text: 'Reporte por Criterio', style: 'titulo' });
    content.push({ text: '\n' });

    // Crea la tabla de datos
    const tableData = [];

    // Estilo para las cabeceras de la tabla
    const headerStyle = {
      fillColor: '#72B6FF', // Color de fondo
      bold: true, // Negrita
      color: '#FFFFFF', // Color de texto
    };
    const criteriosUnicos = Array.from(
      new Set(this.modoVisualizacion === 'cualitativo' ?
        this.criteriosCuali.map((indicador) => indicador.nombrecriterio) :
        this.criteriosCuanti.map((indicador) => indicador.nombrecriterio)
      )
    );
    criteriosUnicos.forEach((criterio) => {
      const indicadoresCriterio = this.modoVisualizacion === 'cualitativo' ?
        this.criteriosCuali.filter((indicador) => indicador.nombrecriterio === criterio) :
        this.criteriosCuanti.filter((indicador) => indicador.nombrecriterio === criterio);

      // Genera la tabla para el criterio actual
      const tableDataCriterio = [];
      tableDataCriterio.push([
        { text: 'SUBCRITERIO', style: headerStyle },
        { text: 'INDICADOR', style: headerStyle },
        { text: 'DESCRIPCIÓN', style: headerStyle },
        { text: 'VALOR OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE OBTENIDO', style: headerStyle },
        { text: 'PORCENTAJE UTILIDAD', style: headerStyle },
      ]);

      indicadoresCriterio.forEach((indicador, index) => {
        const rowStyle = index % 2 === 0 ? { fillColor: '#F2F2F2' } : {}; // Colores intercalados

        tableDataCriterio.push([
          { text: indicador.nombresubcriterio, style: rowStyle },
          { text: indicador.nombreindicador, style: rowStyle },
          { text: indicador.descripcionindicador, style: rowStyle },
          { text: indicador.valorobtenido, style: rowStyle },
          { text: indicador.porcentajeobtenido, style: rowStyle },
          { text: indicador.porcentajeutilidad, style: rowStyle },
        ]);
      });

      // Agrega la tabla al contenido del informe
      content.push({
        text: ' - Criterio: ' + criterio,
        style: 'subtitulo',
      });
      content.push({
        table: {
          headerRows: 1,
          body: tableDataCriterio,
        },
        style: 'tabla',
      });
    });

    const footer = function (currentPage: number, pageCount: number) {
      return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' };
    };

    const styles = {
      titulo: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subtitulo: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tabla: {
        margin: [0, 10, 0, 10],
      },
    };

    // Crea el documento PDF
    const documentDefinition: any = {
      content,
      styles,
      pageOrientation: 'landscape',
    };
    // Genera el PDF y descárgalo
    pdfMake.createPdf(documentDefinition).download('ReportesIndicadores.pdf');
  }
}

