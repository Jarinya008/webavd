
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
  selector: 'app-userlog',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './userlog.component.html',
  styleUrl: './userlog.component.scss'
})
export class UserlogComponent {
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
  ngOnInit(): void {
    //this.callApi();
    //console.log(this.users);
    
  }
  async callApi() {
    const url = this.constants.API_ENDPOINT;
    
    this.http.get(url).subscribe((data: any) => {
      console.log(data);
      this.users = data;
      console.log(this.image_bigin);
      console.log(this.users);
      this.image_bigin = url + this.users[0].image_avatar;
    });

    
  }
  register() {
    this.router.navigate(['/usersign']);
    const url = this.constants.API_ENDPOINT+'/user';
  
    // Serialize form data
    // const formData = {
    //   username: this.frmRegister.value.username,
    //   password: this.frmRegister.value.password
    // };
  
    // Send serialized form data
    // this.http.post(url, formData).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     alert('correct signin');
    //   },
    //   error: (err) => {
    //     console.error('Error registering user:', err);
    //     this.signerr = 'Duplicate username, please enter again'
    //   }
    // });
  }

  async login(username:HTMLInputElement,password:HTMLInputElement) {
    const url = this.constants.API_ENDPOINT+'/user/login';
    const formData = {
      username: this.frmRegister.value.username,
      password: this.frmRegister.value.password
    };      
    let data = await lastValueFrom(
      this.http.get(url, {
        params: {    
          username: username.value,
          password: password.value
        },
      })
    );
    this.dataLogin = data as UserGet[];
    console.log(data);
    if(this.dataLogin.length>0){
      if(this.dataLogin[0].type == 'user'){
      this.router.navigate(['/'], { state: { data: this.dataLogin } });
      this.printData();
      }else{
        this.router.navigate(['/mainadmin'], { state: { data: this.dataLogin } });
      }
    }
    else{
      alert('Username or password incorrect. Please try again.');
      this.mistake = "Username or password incorrect. Please try again."
      
    }
    
  }

  printData(){
    const url = this.constants.API_ENDPOINT+this.dataLogin[0].image_avatar;
    this.image_bigin = url;
  }
}




