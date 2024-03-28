import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
import { UserGet } from '../../model/user_get';
import { lastValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule,FormsModule,MatIconModule,MatToolbarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
  users : UserGet[] = [];
  dataLogin:any[]=[];
  image_bigin : String = '';
  mistake : string = '';
  signerr : string = '';
  data: any;
  datapic:any[] = [];
  image_avatar: any; // ใช้เก็บไฟล์รูปภาพ
  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe(params => {
      this.data = window.history.state.data;
      console.log(this.data[0].username);
    });
  }
  // updateProfile() {
  //   const url = this.constants.API_ENDPOINT + '/upload/updateavatar/' + this.data[0].username;
  //   const formData = new FormData();
  //   const data = formData.append('image_avatar', this.image_avatar);
  
  //   // ทดสอบแสดงค่าข้อมูลใน FormData ใน console
  //   console.log(this.data[0].username);
  //   console.log(url);
  //   console.log(this.image_avatar);
  
  //   this.http.put<any>(url, data).subscribe(
  //     response => {
  //       console.log('Image uploaded successfully:', response);
  //       // ทำสิ่งที่คุณต้องการหลังจากการอัปโหลดภาพสำเร็จ เช่น รีเซ็ตฟอร์ม แสดงข้อความเตือน เป็นต้น
  //       alert('Image uploaded successfully!');
  //     },
  //     error => {
  //       console.error('Error uploading image:', error);
  //       // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการอัปโหลดภาพ เช่น แสดงข้อความเตือน เป็นต้น
  //       alert('An error occurred while uploading image.');
  //     }
  //   );
  // }
  updateProfile() {
    // console.log(username);
    
    let url;
    //if(username != null){
      //url = this.constants.API_ENDPOINT + '/upload/updateavatar/' + username.toString();
    //}else{
      url = this.constants.API_ENDPOINT + '/upload/updateavatar/' + this.data[0].username;
    //}
    
    const formData = new FormData();
    const fileInput = <HTMLInputElement>document.getElementById('url_image'); // Access the file input element
    
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('url_image', fileInput.files[0]); // Append the selected file to the FormData object
    } else {
      console.error('No file selected.');
      return;
    }
  
    // Send the FormData object to the server using HttpClient
    this.http.put<any>(url, formData).subscribe(
      async response => {
        console.log('Image uploaded successfully:', response);
        // Handle success, e.g., display a success message
        const url = this.constants.API_ENDPOINT+'/user/login';     
        let data = await lastValueFrom(
          this.http.get(url, {
            params: {    
              username: this.data[0].username,
              password: this.data[0].password
            },
          })
        );
        this.dataLogin = data as UserGet[];
        console.log(data);
          if(this.dataLogin[0].type == 'user'){
          this.router.navigate(['/'], { state: { data: this.dataLogin } });
          }else{
            this.router.navigate(['/mainadmin'], { state: { data: this.dataLogin } });
          }   
        alert('Image uploaded successfully!');
      },
      error => {
        console.error('Error uploading image:', error);
        // Handle error, e.g., display an error message
        alert('An error occurred while uploading image.');
      }
    );
  }
  goback(){
    window.history.back();
  }
  
}
