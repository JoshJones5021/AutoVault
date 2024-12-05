import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
})
export class CarListComponent implements OnInit, OnChanges {
  @Input() selectedFilter: string = '';
  @Input() searchText: string = '';
  selectedSubFilter: string = '';
  subFilterOptions: string[] = [];

  cars: any[] = [];
  filteredCars: any[] = [];
  paginatedCars: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4; // 1 rows per page with 4 items per row
  totalPages: number = 0; // Total number of pages

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getCars();
  }

  ngOnChanges(): void {
    this.applySearch();
  }

  getCars(): void {
    const url = 'https://prod-16.uksouth.logic.azure.com:443/workflows/1d70071974984eecb9e84c4aaddb1697/triggers/When_a_HTTP_request_is_received/paths/invoke';
    let params = new HttpParams()
      .set('api-version', '2016-10-01')
      .set('sp', '/triggers/When_a_HTTP_request_is_received/run')
      .set('sv', '1.0')
      .set('sig', 'GMGgLH047BRHA7PF3RilT5bBbtXJWzfdqkhs8jF437U')
      .set('make', '')
      .set('model', '')
      .set('search', '')
      .set('userID', '')
      .set('page', '1')
      .set('pageSize', '100'); // Fetch a large number of cars initially

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        console.log('Fetched cars:', response.data); // Log the fetched data
        this.cars = response.data;
        this.filteredCars = [...this.cars];
        this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
        this.updatePaginatedCars();
      },
      (error) => {
        console.error('Error fetching cars', error);
      }
    );
  }

  getCarImage(car: any): string {
    const imageMedia = car.media.find((media: any) => media.type === 'image/jpeg' || media.type === 'image/png');
    return imageMedia ? `https://autovaultstorage.blob.core.windows.net${imageMedia.filePath}` : 'assets/default-car.jpg'; // Fallback to a default image if no image is found
  }

  onFilterChange(): void {
    if (this.selectedFilter) {
      this.subFilterOptions = [...new Set(this.cars.map(car => car[this.selectedFilter]))];
    } else {
      this.subFilterOptions = [];
    }
    this.selectedSubFilter = '';
    this.applySearch();
  }

  applySearch(): void {
    this.filteredCars = this.cars.filter((car) => {
      const filterField = this.selectedFilter
        ? car[this.selectedFilter].toLowerCase()
        : `${car.make} ${car.model} ${car.description}`.toLowerCase();
      const matchesSearchText = `${car.make} ${car.model} ${car.description}`.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesSubFilter = this.selectedSubFilter
        ? car[this.selectedFilter] === this.selectedSubFilter
        : true;
      return matchesSearchText && matchesSubFilter;
    });
    this.currentPage = 1; // Reset to first page on search
    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
    this.updatePaginatedCars();
  }

  updatePaginatedCars(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCars = this.filteredCars.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCars(); // Update the paginated cars for the selected page
    }
  }

  goToCarDetails(carId: string, userId: string): void {
    this.router.navigate(['/cars', carId], { queryParams: { userID: userId } });
  }
}