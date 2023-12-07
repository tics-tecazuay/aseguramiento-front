import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';




@Component({
  selector: 'app-actividad-criterio-modelo',
  templateUrl: './actividad-criterio-modelo.component.html',
  styleUrls: ['./actividad-criterio-modelo.component.css']
})
export class ActividadCriterioModelo implements OnInit {
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
    this.router.navigate(['/res/detalleC']);
  }

  enviarModelo(modelo: Modelo): void {
    localStorage.setItem("id", modelo.id_modelo.toString());
    this.mode = modelo;
    this.router.navigate(['/res/detalleC']);
  }

}