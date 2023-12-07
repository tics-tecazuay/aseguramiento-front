
export class asigna_R{
    id_asignacion:number=0;
    usuario!: usuario;
    criterio!: Criterio;
    modelo!: Modelo;
}

interface usuario{
    id: number;
    username: string ;
    pasword: string ;
    estado: string;
    // accountNonExpired:boolean;
    // accountNonLocked:boolean;
    // authorities:authorities | undefined;
    // credentialsNonExpired:boolean;
}

interface authorities{
    authority:string;
}

interface Criterio{
    id_criterio: number;
    nombre:string;
    descripcion:string;
    peso:number;
    estado:string;
}

interface Modelo {
    id_modelo:number;
    // fecha_inicio: Date;
    // fecha_fin:Date;
    // fecha_final_act:Date;
}

