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

import { MatMenuModule } from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-mainadmin',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule,FormsModule,MatMenuModule,MatToolbarModule,MatIconModule],
  templateUrl: './mainadmin.component.html',
  styleUrl: './mainadmin.component.scss'
})
export class MainadminComponent implements OnInit {
  constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
  users : UserGet[] = [];
  mistake : string = '';
  signerr : string = '';
  data: any;
  datauser:any[] = [];
  ngOnInit(): void {
    
    this.ActivatedRoute.paramMap.subscribe(params => {
      this.data = window.history.state.data;
      this.prinData();
    });
    console.log(this.data);
    //location.reload();
  }
  prinData(){
    const urluser = this.constants.API_ENDPOINT+'/admin/manage/user';
    this.http.get(urluser).subscribe((picall: any) => {
      console.log(picall);
      console.log(picall.length);
      this.datauser = picall;
      for(let i=0;i<this.datauser.length;i++){
        this.datauser[i].image_avatar = this.constants.API_ENDPOINT+picall[i].image_avatar;
        console.log(this.datauser[i]);
        
      }
    });
  }
  logout(){
    this.data = [];
    this.router.navigate(['/']);
    console.log(this.data);
    
  }

  goToPage() {
    const menuSelect = document.getElementById('menu') as HTMLSelectElement;
    // รับค่าที่ผู้ใช้เลือก
    const selectedValue = menuSelect.value;
  
    switch(selectedValue) {
      case 'control':
          // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
          // เช่น window.location.href = 'edit-person.html';
          break;
      case 'stat':
          // ทำการเปลี่ยนเส้นทางไปยังหน้าสถิติ
          // เช่น window.location.href = 'statistics.html';
          break;
      case 'logout':
          this.logout();
          break;
      default:
          // กรณีไม่มีค่าที่เลือก
          console.log('No action specified for the selected menu item.');
          break;
  }
  }
  gotostattop(username: HTMLInputElement){
    console.log(username);
    this.router.navigate(['/stattop'], { state: { data: username.toString() } });
   } 
}
