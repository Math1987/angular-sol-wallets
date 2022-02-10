import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Wallet } from '../../wallets/wallet';

@Component({
  selector: 'sw-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  wallets : Wallet[] = [] ;
  title = "Choose your wallet";
  selectEvent : EventEmitter<Wallet> = new EventEmitter();
  quitEvent : EventEmitter<void> = new EventEmitter();


  constructor( public elRef : ElementRef) { }

  ngOnInit(): void {

    //@ts-ignore
    this.elRef.nativeElement.addEventListener('mousedown', ev => {

      const container = document.querySelector("#wallet-container") as HTMLDivElement;
      if ( 
        !(ev.clientX >= container.offsetLeft && ev.clientY <= container.offsetLeft + container.offsetWidth
        && ev.clientY >= container.offsetTop && ev.clientY <= container.offsetTop + container.offsetHeight)
        ){
        this.quitEvent.emit();
      }

    });

  }

  select(i : number ){

    this.selectEvent.emit(this.wallets[i]);

  }

}
