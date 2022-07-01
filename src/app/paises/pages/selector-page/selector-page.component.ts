import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/pais.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  constructor(private fb: FormBuilder, private paisesServices: PaisesService) {}
  cargando: boolean = false;
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    //Cuando cambie la region primer selector
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((region) => {
          this.cargando = true;
          this.miFormulario.get('pais')?.reset('');
        }),
        switchMap((resp: string) => this.paisesServices.getPaisesByRegion(resp))
      )
      .subscribe((dataPaises) => {
        this.paises = dataPaises;
        this.cargando = false;

      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
        this.cargando = true;

          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap((respPaisValueCode) => {
          return this.paisesServices.getPaisesByCode(respPaisValueCode);
        }),
        switchMap((pais)=>{
            return this.paisesServices.getPaisesPorCodigo(pais?.borders??[]);
        })
      )
      .subscribe((fronterasResponse) => {
        this.fronteras = fronterasResponse;
        this.cargando = false;
      });

    // this.miFormulario.get('region')?.valueChanges.subscribe((regionValue) => {
    //   console.log('Valor changes', regionValue);
    //   this.paisesServices
    //     .getPaisesByRegion(regionValue)
    //     .subscribe((dataPaises) => {
    //       this.paises = dataPaises;
    //       console.log(dataPaises);
    //     });
    // });
  }
  guardar() {}
}
