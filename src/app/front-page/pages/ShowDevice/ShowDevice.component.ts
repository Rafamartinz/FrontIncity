import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FrontService } from '../../services/front-service';
import { CommonModule } from '@angular/common';
import { CreateDevice } from '../../interfaces/createDevice.interface';

@Component({
  selector: 'show-device',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './ShowDevice.component.html',
})
export class ShowDeviceComponent implements OnInit {
  route = inject(ActivatedRoute);
  frontservice = inject(FrontService);

  deviceId: string | null = null;
  device: CreateDevice | null = null;
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/ListDevice']);
  }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id');
    console.log('ID del dispositivo:', this.deviceId);

    if (this.deviceId) {
      this.frontservice.getDeviceById(this.deviceId).subscribe((data) => {
        this.device = data;
        console.log('Device:', this.device);
      });
    }
  }
}
