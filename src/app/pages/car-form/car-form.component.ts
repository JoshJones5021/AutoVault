import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  car = {
    id: '', // Car ID for update
    userID: '', // User ID will be set based on the selected car
    userName: 'Josh502Jones', // Hardcoded userName
    make: '',
    model: '',
    description: '',
    fileContent: [] as string[] // Explicitly define the type as an array of strings
  };

  action: string = 'add'; // Default action is 'add'
  availableCars: any[] = []; // List of available cars for update
  successMessage: string = ''; // Success message

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAvailableCars();
  }

  fetchAvailableCars(): void {
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
      .set('pageSize', '100'); // Adjust pageSize as needed

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        console.log('Fetched available cars:', response.data); // Log the fetched data
        this.availableCars = response.data;
      },
      (error) => {
        console.error('Error fetching available cars', error);
      }
    );
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    this.car.fileContent = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.car.fileContent.push(e.target.result as string); // Ensure the result is treated as a string
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit(): void {
    const addUrl = 'https://prod-27.uksouth.logic.azure.com:443/workflows/64c1e90fd8b24d41adbeaa986b7c56dc/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=nkuFmLqUrv2FiDX-3jRkg02eYnJN3HGO8kI6wE7clbs'; // Add car Logic App endpoint
    const updateUrl = 'https://prod-17.uksouth.logic.azure.com:443/workflows/681c114d16eb4c0b9096b42c9c80101a/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=gZDpS7SZk6X2k7SyHZ_NxalZUst0ghokxYGCezoMu8A'; // Update car Logic App endpoint

    if (this.action === 'add') {
      this.http.post(addUrl, this.car).subscribe(response => {
        console.log('Car added successfully', response);
        this.successMessage = 'Car added successfully!';
        this.resetForm();
      }, error => {
        console.error('Error adding car', error);
      });
    } else if (this.action === 'update') {
      this.http.put(updateUrl, this.car).subscribe(response => {
        console.log('Car updated successfully', response);
        this.successMessage = 'Car updated successfully!';
        this.resetForm();
      }, error => {
        console.error('Error updating car', error);
      });
    }
  }

  resetForm(): void {
    this.car = {
      id: '',
      userID: '',
      userName: 'Josh502Jones',
      make: '',
      model: '',
      description: '',
      fileContent: []
    };
    this.action = 'add';
    this.successMessage = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }

  onActionChange(): void {
    if (this.action === 'update') {
      this.fetchAvailableCars();
    }
  }

  onCarChange(): void {
    if (this.action === 'update') {
      const selectedCar = this.availableCars.find(car => car.id === this.car.id);
      if (selectedCar) {
        this.car.userID = selectedCar.userID;
      }
    }
  }
}