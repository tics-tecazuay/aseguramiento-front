import { Component, OnInit } from '@angular/core';
import { Ponderacion } from 'src/app/models/Ponderacion';
import Swal from 'sweetalert2';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Modelo } from 'src/app/models/Modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { PonderacionService } from 'src/app/services/ponderacion.service';
@Component({
  selector: 'app-ponderacion',
  templateUrl: './ponderacion.component.html',
  styleUrls: ['./ponderacion.component.css']
})
export class PonderacionComponent implements OnInit {

  dataSource: any;
  ponderacionClase: Ponderacion = new Ponderacion();
  myForm: FormGroup;
  model: Modelo = new Modelo();


  constructor(
    private servicePonderacion: PonderacionService,
    public fb: FormBuilder,
    private router: Router,
    private sharedDataService: SharedDataService,
    private modeloService: ModeloService
  ) {
    this.myForm = fb.group({});
  }

  ngOnInit(): void {
    this.listarPonderacion();
    this.listarSub();
    this.listar();
   
  }

  //Crear Ponderacion
  crearPonderacion() {


    this.servicePonderacion.guardarPonderacion(this.ponderacionClase)
      .subscribe(
        (data: any) => {
          console.log('Ponderacion creada con éxito:', data);
          Swal.fire(
            'Ponderacion Registrada!',
            'success'
          );
          this.listarPonderacion();
        },
        (error: any) => {
          console.error('Error al crear:', error);
        }
      );
    


  }

  listarPonderacion() {
    this.servicePonderacion.listarPonderacion().subscribe(data => {
      this.dataSource = data;
    });
    console.log(this.dataSource+'lista');
  }

  listar() {
    this.modeloService.listarModelo().subscribe(data => {
      this.dataSource = data;
    });
    console.log(this.dataSource+'lista');
  }

  modificarPonderacion() {
    this.servicePonderacion.actualizar(this.ponderacionClase.id_ponderacion, this.ponderacionClase)
      .subscribe(data => {
        console.log('Ponderacion creada con éxito:', data);

        this.listarPonderacion();
      })
  }
  listarSub(): void {
    this.servicePonderacion.listarPonderacion().subscribe(
      (data: Ponderacion[]) => {
        this.dataSource = data;
      },
      (error: any) => {
        console.error('Error al listar los indicadores:', error);
      }
    );
  }


  recibeModelo() {
    let id = localStorage.getItem("id");
    this.modeloService.getModeloById(Number(id)).subscribe(data => {
      this.model = data;
    })


  }

}
