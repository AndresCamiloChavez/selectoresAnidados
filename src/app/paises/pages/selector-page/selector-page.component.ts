import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/pais.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  constructor(private fb: FormBuilder, private paisesServices: PaisesService) {}

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    //Cuando cambie la region primer selector
    this.miFormulario.get('region')?.valueChanges.pipe(
        tap( (region) => {
          this.miFormulario.get('pais')?.reset('');
        }),
        switchMap((resp: string) => this.paisesServices.getPaisesByRegion(resp)),
        ).subscribe(dataPaises => this.paises = dataPaises);

        this.miFormulario.get('pais')?.valueChanges.subscribe(pais => {
            console.log('valor del país', pais);
            
        })

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
