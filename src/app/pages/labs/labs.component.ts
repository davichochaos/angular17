import { Component, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome='Bienvenido Angular17';
  lists = signal([
    'item1',
    'item2',
    'item3',
    'item4',
  ]);
  name = signal('David');
  age = 30;
  disabled = true;
  img = 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/world-of-warcraft/1/11/WoW_Logo.png?width=1280';
  person = signal({
    name: 'david',
    age: 19,
    avatar: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/world-of-warcraft/1/11/WoW_Logo.png?width=1280',
  })

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCtrl = new FormControl('David', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  clickHandler(){
    alert('hola');
  }

  changeHandler(event: Event) {
    //console.log(event);
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    //console.log(event);
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
  }

  changeName(event: Event) {
    //console.log(event);
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    });
  }
}
