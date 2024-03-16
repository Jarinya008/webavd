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
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule,FormsModule,MatMenuModule,MatToolbarModule,MatIconModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent implements OnInit{
  username: any;
  name_image: any;
  url_image: any;
  Diff: any;
  
    constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
    users : UserGet[] = [];
    dataLogin:any[]=[];
    image_bigin : String = '';
    mistake : string = '';
    signerr : string = '';
    data: any;
    randompic:any[]=[];
    id_imagevote:number = 0;

    ngOnInit(): void {

      this.randomimage();
      this.topten();
      this.ActivatedRoute.paramMap.subscribe(params => {
        this.data = window.history.state.data;
        //this.printData();
        this.data[0].image_avatar = this.constants.API_ENDPOINT +this.data[0].image_avatar;
        
      });
      if(this.data == undefined){
        this.data = [];
        console.log(this.data.length);
      }      

      console.log(this.data[0].image_avatar);
      this.diff();
      
    }

    secondspic:number = 0;
    rpa:number = 0;
    rpb:number = 0;
    stra:string = '';
    strb:string = '';
    forwait:number = 0;

    diff(){
      const urlvote = this.constants.API_ENDPOINT + '/user/look/diff/top';
      this.http.get(urlvote).subscribe((rankdif: any)=>{
        this.Diff = rankdif;
        console.log("Rank diff",this.Diff);
        
      });
    }

    async voteimage(pic:HTMLInputElement){
      console.log(pic);
      const id_image1 = this.randompic[0].id_image;
      const id_image2 = this.randompic[1].id_image;
      console.log(id_image1);
      console.log(id_image2);
      
      
      let point1:number;
      let point2:number;
      const ra = this.randompic[0].score_image;
      const rb = this.randompic[1].score_image;
      if(pic == this.randompic[0].id_image){
          point1 = 1;
          point2 = 0;
          this.stra = 'win';
          this.strb = 'lose';
      }else{
        point1 = 0;
        point2 = 1;
      }
      const ea = 1 / (1 + Math.pow(10, (rb - ra) / 400));
      const eb = 1 / (1 + Math.pow(10, (ra - rb) / 400));
      console.log("ea=" + ea);
      console.log("eb=" + eb);
      this.rpa = ra + 32 * (point1 - ea);
      this.rpb = rb + 32 * (point2 - eb);

        //location.reload();
        //this.voteimage(pic);
        //return;
        this.secondspic = +pic;
        const postData = {
          id_image1: id_image1,
          id_image2: id_image2,
          point1: point1,
          point2: point2, // ใช้ index 1 เนื่องจากมีภาพสุ่มอีกตัว
          rpa: this.rpa,
          rpb: this.rpb

        };
        const urlvote = this.constants.API_ENDPOINT + '/voteimage/elo';

        this.http.post(urlvote, postData).subscribe({
          next: (res) => {
            // ตอบสนองจากเซิร์ฟเวอร์ที่ส่งกลับมา
            console.log(res);
            alert('correct vote');
          },
          error: (err) => {
            // จัดการข้อผิดพลาดที่เกิดขึ้น
            alert('incorrect vote');
            console.error('Error registering user:', err);
          }
        }); 
        //alert('correct vote!!\nwait 2 seconds for vote image');
        await this.delay(2000);

        //location.reload();
        this.randomimage();
    }
    showrp(){

    }
    toptentoday:any = '';
    toptenyesterday:any = '';
    topten(){
      const urltop = this.constants.API_ENDPOINT + '/user/topten/today';
      console.log(urltop);
      
      this.http.get(urltop).subscribe((toptoday: any) => {
        console.log(toptoday);
        
        this.toptentoday = toptoday;
        for(let i=0;i<this.toptentoday.length;i++){
          this.toptentoday[i].url_image = this.constants.API_ENDPOINT+toptoday[i].url_image;
          //console.log(this.randompic[i]);
          
        }
        console.log(this.toptentoday); // แสดงฟังก์ชัน randomimage
      });
    }

    // secondspic:number = 0;
    // async voteimage(pic:HTMLInputElement){
    //   console.log(pic);
    //   const id_image1 = this.randompic[0].id_image;
    //   const id_image2 = this.randompic[1].id_image;
    //   let point1:number;
    //   let point2:number;
    //   if(pic == this.randompic[0].id_image){
    //       point1 = 1;
    //       point2 = 0;
    //   }else{
    //     point1 = 0;
    //     point2 = 1;
    //   }
    //     //location.reload();
    //     //this.voteimage(pic);
    //     //return;
    //     this.secondspic = +pic;
    //     const postData = {
    //       id_image1: id_image1,
    //       id_image2: id_image2,
    //       point1: point1,
    //       point2: point2 // ใช้ index 1 เนื่องจากมีภาพสุ่มอีกตัว
    //     };
    //     const urlvote = this.constants.API_ENDPOINT + '/voteimage/elo';

    //     this.http.post(urlvote, postData).subscribe({
    //       next: (res) => {
    //         // ตอบสนองจากเซิร์ฟเวอร์ที่ส่งกลับมา
    //         console.log(res);
    //         alert('correct vote');
    //       },
    //       error: (err) => {
    //         // จัดการข้อผิดพลาดที่เกิดขึ้น
    //         alert('incorrect vote');
    //         console.error('Error registering user:', err);
    //       }
    //     }); 
    //     //alert('correct vote!!\nwait 2 seconds for vote image');
    //     //await this.delay(2000);
    //     location.reload();
    //     this.randomimage();
    // }
    async delay(ms: number) {
      alert('correct vote!!\nwait 2 seconds for vote image');
      const overlay = document.createElement('div');
      
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      //overlay.style.background = 'rgba(0, 0, 0, 0.5)'; // Transparent black
      overlay.style.zIndex = '9999'; // Ensure the overlay is on top of everything
      if(this.rpa > this.rpb){
        overlay.textContent = '+'+this.rpa+'('+this.randompic[0].name_image+' by '+this.randompic[0].username+')\n'+
                              '-'+this.rpa+'('+this.randompic[1].name_image+' by '+this.randompic[1].username+')';
      }else{
        overlay.textContent = '-'+this.rpa+'('+this.randompic[0].name_image+' by '+this.randompic[0].username+')\n'+
                              '+'+this.rpb+'('+this.randompic[1].name_image+' by '+this.randompic[1].username+')';
      }
      
      document.body.appendChild(overlay);

      await new Promise((resolve) => setTimeout(resolve, ms));           
      // Re-enable user interaction and remove the overlay
      //overlay.parentNode.removeChild(overlay);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      // Re-enable user interaction with the HTML elements here
    }
    randomimage() {
      // ดึง URL ของ API ที่มีข้อมูลรูปภาพสุ่ม
      const urlall = this.constants.API_ENDPOINT+'/random-image';
      
      // ใช้ HTTP GET เพื่อเรียกข้อมูลรูปภาพ
      this.http.get(urlall).subscribe((picran: any) => {
        this.randompic = picran.pic1;
        for(let i=0;i<this.randompic.length;i++){
          this.randompic[i].url_image = this.constants.API_ENDPOINT+this.randompic[i].url_image;
          //console.log(this.randompic[i]);
          
        }
      console.log(this.randompic); // แสดงฟังก์ชัน randomimage
      });
    }
    
    printData(){
      const url = this.constants.API_ENDPOINT+this.data[0].image_avatar;
      this.image_bigin = url;
      console.log(this.image_bigin);
      
    }
    logout(){
      this.image_bigin = '';
      this.data = [];
      this.dataLogin=[];
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
          // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
          // เช่น window.location.href = 'edit-person.html';
          this.router.navigate(['/profile'], { state: { data: this.data } });
          break;
      case 'uploadpic':
          this.router.navigate(['/uploaded'], { state: { data: this.data } });
          break;
      case 'stat':
        this.router.navigate(['/stat'], { state: { data: this.data } });
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

  





// username: any;
// name_image: any;
// url_image: any;

//   constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
//   users : UserGet[] = [];
//   dataLogin:any[]=[];
//   image_bigin : String = '';
//   mistake : string = '';
//   signerr : string = '';
//   data: any;
//   randompic:any[]=[];
//   ngOnInit(): void {
//     this.randomimage();
//     this.ActivatedRoute.paramMap.subscribe(params => {
//       this.data = window.history.state.data;
//       //this.printData();
//       this.data[0].image_avatar = this.constants.API_ENDPOINT +this.data[0].image_avatar;
      
//     });
//     console.log(this.data[0].image_avatar);
    
//   }
//   voteimage(pic:HTMLInputElement){
//     console.log(pic);
//     const id_image1 = this.randompic[0].id_image;
//     const id_image2 = this.randompic[1].id_image;
//     let point1:number;
//     let point2:number;
//     if(pic == this.randompic[0].id_image){
//         point1 = 1;
//         point2 = 0;
//     }else{
//       point1 = 0;
//       point2 = 1;
//     }
//     console.log(id_image1);
//     console.log(id_image2);
//     console.log(point1);
//     console.log(point2);
//     const postData = {
//       id_image1: id_image1,
//       id_image2: id_image2,
//       point1: point1,
//       point2: point2 // ใช้ index 1 เนื่องจากมีภาพสุ่มอีกตัว
//     };
//     const urlvote = this.constants.API_ENDPOINT + '/voteimage/elo';
    
//     this.http.post(urlvote, postData).subscribe({
//       next: (res) => {
//         //location.reload();
//         // ตอบสนองจากเซิร์ฟเวอร์ที่ส่งกลับมา
//         console.log(res);
//         alert('correct signin');
//       },
//       error: (err) => {
//         // จัดการข้อผิดพลาดที่เกิดขึ้น
//         console.error('Error registering user:', err);
//         this.signerr = 'Duplicate username, please enter again';
//       }
//     });
//     this.randomimage();
    
    
    
//   }
//   randomimage() {
//     // ดึง URL ของ API ที่มีข้อมูลรูปภาพสุ่ม
//     const urlall = this.constants.API_ENDPOINT+'/random-image';
    
//     // ใช้ HTTP GET เพื่อเรียกข้อมูลรูปภาพ
//     this.http.get(urlall).subscribe((picran: any) => {
//       this.randompic = picran.pic1;
//       for(let i=0;i<this.randompic.length;i++){
//         this.randompic[i].url_image = this.constants.API_ENDPOINT+this.randompic[i].url_image;
//         //console.log(this.randompic[i]);
        
//       }
//     console.log(this.randompic); // แสดงฟังก์ชัน randomimage
//     });
//   }
  
//   printData(){
//     const url = this.constants.API_ENDPOINT+this.data[0].image_avatar;
//     this.image_bigin = url;
//     console.log(this.image_bigin);
    
//   }
//   logout(){
//     this.image_bigin = '';
//     this.data = [];
//     this.dataLogin=[];
//     console.log(this.data);
    
//   }

//   upload() {

//     const urlall = this.constants.API_ENDPOINT+'/upload/picall?username='+this.data[0].username;
//     this.http.get(urlall).subscribe((picall: any) => {
//       console.log(picall);
//       console.log(picall.length);
      
//     if(picall.length < 5){
//     // ตรวจสอบว่ามีการเลือกไฟล์รูปหรือไม่
//     const fileInput = (document.getElementById('url_image') as HTMLInputElement);
//     if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
//         alert('Please select an image file');
//         return;
//     }

//     // สร้าง FormData object และเพิ่มข้อมูล username, name_image และ url_image เข้าไป
//     const formData = new FormData();
//     this.username = this.data[0].username;
//     formData.append('username', this.username);
//     formData.append('name_image', this.name_image);
//     formData.append('url_image', fileInput.files[0]);

//     const url = this.constants.API_ENDPOINT+'/upload';
//     // ส่งข้อมูลไปยังเซิร์ฟเวอร์โดยใช้ HttpClient
//     this.http.post<any>(url, formData).subscribe(
//         response => {
//             console.log('Image uploaded successfully:', response);
//             // ทำสิ่งที่คุณต้องการหลังจากการอัปโหลดภาพสำเร็จ เช่น รีเซ็ตฟอร์ม แสดงข้อความเตือน เป็นต้น
//             alert('Image uploaded successfully!');
//         },
//         error => {
//             console.error('Error uploading image:', error);
//             // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการอัปโหลดภาพ เช่น แสดงข้อความเตือน เป็นต้น
//             alert('An error occurred while uploading image.');
//         }
//     );
//       }
//       else{
//         alert('your image is full, plaese delete your image before')
//       }
//   });
// }
// goToPage() {
//   const menuSelect = document.getElementById('menu') as HTMLSelectElement;
//   // รับค่าที่ผู้ใช้เลือก
//   const selectedValue = menuSelect.value;

//   switch(selectedValue) {
//     case 'menuselect':
        
//     // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
//     // เช่น window.location.href = 'edit-person.html';
//     break;
//     case 'editperson':
//         // ทำการเปลี่ยนเส้นทางไปยังหน้าแก้ไขข้อมูลส่วนตัว
//         // เช่น window.location.href = 'edit-person.html';
//         this.router.navigate(['/profile'], { state: { data: this.data } });
//         break;
//     case 'uploadpic':
//         this.router.navigate(['/uploaded'], { state: { data: this.data } });
//         break;
//     case 'stat':
//         // ทำการเปลี่ยนเส้นทางไปยังหน้าสถิติ
//         // เช่น window.location.href = 'statistics.html';
//         break;
//     case 'logout':
//         this.logout();
//         break;
//     default:
//         // กรณีไม่มีค่าที่เลือก
//         console.log('No action specified for the selected menu item.');
//         break;
// }
// }


// }
