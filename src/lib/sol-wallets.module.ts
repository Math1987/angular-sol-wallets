import { NgModule } from '@angular/core';
import { SolWalletsComponent } from './sol-wallets.component';
import { BrowserModule } from '@angular/platform-browser';
import { ModalComponent } from './modal/modal/modal.component';



@NgModule({
  declarations: [
    SolWalletsComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    SolWalletsComponent
  ]
})
export class SolWalletsModule { }
