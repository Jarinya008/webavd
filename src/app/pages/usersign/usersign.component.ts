import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
import { UserGet } from '../../model/user_get';
import { lastValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-usersign',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './usersign.component.html',
  styleUrl: './usersign.component.scss'
})
export class UsersignComponent {
  constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private router: Router){}
  users : UserGet[] = [];
  dataLogin:any[]=[];
  image_bigin : String = '';
  mistake : string = '';
  signerr : string = '';
  frmRegister = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  back(){
    this.router.navigate(['/userlog']);
  }
  register() {
    const url = this.constants.API_ENDPOINT+'/user';
  
    // Serialize form data
    const formData = {
      username: this.frmRegister.value.username,
      password: this.frmRegister.value.password
    };
  
    // Send serialized form data
    if(formData.username != ' ' && formData.password != ' s'){
    this.http.post(url, formData).subscribe({
      next: (res) => {
        console.log(res);
        alert('correct signin');
        this.router.navigate(['/userlog']);
      },
      error: (err) => {
        console.error('Error registering user:', err);
        this.signerr = 'Duplicate username, please enter again'
      }
    });
  }
  }

}
