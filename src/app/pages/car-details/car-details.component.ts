import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  carId: string | null = null;
  userID: string | null = null;
  car: any;
  currentMediaIndex: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.carId = params.get('id');
    });
    this.route.queryParamMap.subscribe(params => {
      this.userID = params.get('userID');
      this.getCarDetails();
    });
  }

  getCarDetails(): void {
    const url = 'https://prod-14.uksouth.logic.azure.com:443/workflows/fa606eec1df04733a44614f07614e41c/triggers/When_a_HTTP_request_is_received/paths/invoke';
    let params = new HttpParams()
      .set('api-version', '2016-10-01')
      .set('sp', '/triggers/When_a_HTTP_request_is_received/run')
      .set('sv', '1.0')
      .set('sig', 'aUG8lr25FueCeWHCGve4uhJHyhN7ixo0g3R4mk6IXHg')
      .set('id', this.carId || '')
      .set('userID', this.userID || '');

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        console.log('Fetched car details:', response.value[0]); // Log the fetched data
        this.car = response.value[0];
      },
      (error) => {
        console.error('Error fetching car details', error);
      }
    );
  }

  getMediaUrl(filePath: string): string {
    return `https://autovaultstorage.blob.core.windows.net${filePath}`;
  }

  deleteCar(): void {
    const url = 'https://prod-12.uksouth.logic.azure.com:443/workflows/0ba8938691de432e8e66c55289f39f1a/triggers/When_a_HTTP_request_is_received/paths/invoke';
    let params = new HttpParams()
      .set('api-version', '2016-10-01')
      .set('sp', '/triggers/When_a_HTTP_request_is_received/run')
      .set('sv', '1.0')
      .set('sig', 'uSaQjfWR63CbbEo-cYLTV0cryoHsGpyv7AK_MmjUC2c')
      .set('id', this.carId || '')
      .set('userID', this.userID || '');

    this.http.delete(url, { params }).subscribe(
      (response) => {
        console.log('Car deleted successfully');
        this.router.navigate(['/cars']); // Navigate back to the car list page
      },
      (error) => {
        console.error('Error deleting car', error);
      }
    );
  }

  deleteMedia(): void {
    if (!this.car || !this.car.media || this.car.media.length === 0) {
      console.error('No media to delete');
      return;
    }

    const currentMedia = this.car.media[this.currentMediaIndex];
    const mediaID = currentMedia.filePath;

    console.log('Deleting media:', currentMedia); // Log the media being deleted

    const url = 'https://prod-25.uksouth.logic.azure.com:443/workflows/2088c899dc6f41109c0a10505ad346c7/triggers/When_a_HTTP_request_is_received/paths/invoke';
    let params = new HttpParams()
      .set('api-version', '2016-10-01')
      .set('sp', '/triggers/When_a_HTTP_request_is_received/run')
      .set('sv', '1.0')
      .set('sig', 'wiYSvloN05coiuHKoMXXX_xIRdpMoEOy3qTUoWXQrKY')
      .set('id', this.carId || '')
      .set('userID', this.userID || '')
      .set('mediaID', mediaID);

    this.http.delete(url, { params }).subscribe(
      (response) => {
        console.log('Media deleted successfully');
        // Remove the deleted media from the car.media array
        this.car.media.splice(this.currentMediaIndex, 1);
        // Reset the current media index if necessary
        if (this.currentMediaIndex >= this.car.media.length) {
          this.currentMediaIndex = this.car.media.length - 1;
        }
      },
      (error) => {
        console.error('Error deleting media', error);
      }
    );
  }

  selectMedia(index: number): void {
    this.currentMediaIndex = index;
    console.log('Selected media index:', this.currentMediaIndex); // Log the selected media index
  }
}