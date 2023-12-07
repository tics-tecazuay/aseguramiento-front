import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent {

  datasource: any[] = [];

  constructor(public dialog: MatDialog, private router: Router, private modeloService: ModeloService) { }
  
  ngOnInit(): void {
    this.modeloService.listarModelo().subscribe(data => {
      this.datasource = data;
    });
  }

  irDetalle(object: any) {
    localStorage.setItem("idM", object.id_modelo.toString());
    console.log(object.id_modelo)
    this.router.navigate(['/aut/reporte']);
  }

}
