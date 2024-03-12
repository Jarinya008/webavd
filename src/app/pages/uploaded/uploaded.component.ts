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
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-uploaded',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule,FormsModule],
  templateUrl: './uploaded.component.html',
  styleUrl: './uploaded.component.scss'
})
export class UploadedComponent implements OnInit{
  username: any;
  name_image: any;
  url_image: any;
  
    constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
    users : UserGet[] = [];
    dataLogin:any[]=[];
    image_bigin : String = '';
    mistake : string = '';
    signerr : string = '';
    data: any;
    datapic:any[] = [];
    ngOnInit(): void {
      this.ActivatedRoute.paramMap.subscribe(params => {
        this.data = window.history.state.data;
        console.log(this.data[0]);
        this.printData();
      });
      
      
    }
    goback(){
      window.history.back();
    }
    deletepic(idpic:HTMLInputElement){
      console.log(idpic);
      const url = this.constants.API_ENDPOINT+'/delete?id_image='+idpic;
      this.http.delete(url).subscribe({
        next: (res) => {
          console.log(res);
            const url2 = this.constants.API_ENDPOINT+'/user/?id_image='+idpic;
            this.http.delete(url2).subscribe({
              next: (res) => {
                console.log(res);
                alert('Successfully deleted');
                location.reload();
              },
              error: (err) => {
                console.error('Error deleting image:', err);
                // Handle error
              }
            });  
        },
        error: (err) => {
          console.error('Error deleting image:', err);
          // Handle error
        }
      });


      
    }
    printData(){
      const url = this.constants.API_ENDPOINT+this.data[0].image_avatar;
      this.image_bigin = url;
      console.log(this.image_bigin);
      const urlup = this.constants.API_ENDPOINT+'/upload/picall?username='+this.data[0].username;
  
      // Serialize form data
      console.log(this.data[0].username);
      
      // Send serialized form data
      this.http.get(urlup).subscribe((picall: any) => {
        console.log(picall);
        console.log(picall.length);
        this.datapic = picall;
        for(let i=0;i<this.datapic.length;i++){
          this.datapic[i].url_image = this.constants.API_ENDPOINT+picall[i].url_image;
          console.log(this.datapic[i]);
          
        }
      });
      
    }
    logout(){
      this.image_bigin = '';
      this.data = [];
      console.log(this.data);
      
    }
  
    upload() {
  
      const urlall = this.constants.API_ENDPOINT+'/upload/picall?username='+this.data[0].username;
      this.http.get(urlall).subscribe((picall: any) => {
        console.log(picall);
        console.log(picall.length);
        
      if(picall.length < 5){
      // ตรวจสอบว่ามีการเลือกไฟล์รูปหรือไม่
      const fileInput = (document.getElementById('url_image') as HTMLInputElement);
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          alert('Please select an image file');
          return;
      }
  
      // สร้าง FormData object และเพิ่มข้อมูล username, name_image และ url_image เข้าไป
      const formData = new FormData();
      this.username = this.data[0].username;
      formData.append('username', this.username);
      formData.append('name_image', this.name_image);
      formData.append('url_image', fileInput.files[0]);
  
      const url = this.constants.API_ENDPOINT+'/upload';
      // ส่งข้อมูลไปยังเซิร์ฟเวอร์โดยใช้ HttpClient
      this.http.post<any>(url, formData).subscribe(
          response => {
              console.log('Image uploaded successfully:', response);
              // ทำสิ่งที่คุณต้องการหลังจากการอัปโหลดภาพสำเร็จ เช่น รีเซ็ตฟอร์ม แสดงข้อความเตือน เป็นต้น
              alert('Image uploaded successfully!');
              location.reload();
          },
          error => {
              console.error('Error uploading image:', error);
              // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการอัปโหลดภาพ เช่น แสดงข้อความเตือน เป็นต้น
              alert('An error occurred while uploading image.');
          }
      );
        }
        else{
          alert('your image is full, plaese delete your image before')
        }
    });
  }
  goToPage() {
    const menuSelect = document.getElementById('menu') as HTMLSelectElement;
    // รับค่าที่ผู้ใช้เลือก
    const selectedValue = menuSelect.value;
  
    switch(selectedValue) {
      case 'menuselect':
        
          // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
          // เช่น window.location.href = 'edit-person.html';
          break;
      case 'editperson':
        this.router.navigate(['/profile'], { state: { data: this.data } });
          // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
          // เช่น window.location.href = 'edit-person.html';
          break;
      case 'uploadpic':
          // ทำการเปลี่ยนเส้นทางไปยังหน้าอัปโหลดรูป
          // เช่น window.location.href = 'upload-pic.html';
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
  
  
  }
  
  