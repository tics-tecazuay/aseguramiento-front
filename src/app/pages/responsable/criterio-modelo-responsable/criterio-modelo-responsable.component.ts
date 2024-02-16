import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-criterio-modelo-responsable',
  templateUrl: './criterio-modelo-responsable.component.html',
  styleUrls: ['./criterio-modelo-responsable.component.css']
})
export class CriterioModeloResponsableComponent implements OnInit {
  mode = new Modelo();

  datasource: any[] = [];
  constructor(public dialog: MatDialog, private router: Router, private modeloService: ModeloService) { }
  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.modeloService.listarModelo().subscribe(data => {
      this.datasource = data;
    });
  }

  irDetalle(object: any) {
    this.router.navigate(['/res/detalleCriterio']);
  }
  
  enviarModelo(modelo: Modelo): void {
    localStorage.setItem("id", modelo.id_modelo.toString());
    this.mode = modelo;
    this.router.navigate(['/res/detalleCriterio']);
  }

}
