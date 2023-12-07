
export class Actividad {
    id_actividad!: number;
    nombre!: string;
    descripcion!: string;
    fecha_inicio!: string;
    fecha_fin!: string;
    usuario!:usuario;
}

interface usuario {

    id: number ;
    username: string ;
    pasword: string ;
    estado: string ;
    persona:persona;
  
  }

  interface persona{
    id_persona:number;
    primer_nombre:string;
    primer_apellido:string;
    correo:string;
  }