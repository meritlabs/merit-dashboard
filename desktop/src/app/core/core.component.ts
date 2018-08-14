import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreComponent {
  topMenuItems: any[] = [];
  bottomMenuItems: any[] = [];
  isNetworkView: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url === '/network' || this.router.url === '/') {
      this.isNetworkView = true;
    } else {
      this.isNetworkView = false;
    }
  }
}
