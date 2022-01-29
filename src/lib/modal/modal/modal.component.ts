import { Component, EventEmitter, OnInit } from '@angular/core';
import { Wallet } from '../../wallets/wallet';

@Component({
  selector: 'sw-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  wallets : Wallet[] = [] ;
  title = "Choose your wallet.";
  selectEvent : EventEmitter<Wallet> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  select(i : number ){

    console.log("selected", i);
    this.selectEvent.emit(this.wallets[i]);

  }

}
