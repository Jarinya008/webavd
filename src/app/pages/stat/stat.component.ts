import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
import { UserGet } from '../../model/user_get';
import { combineLatest, lastValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,ReactiveFormsModule,FormsModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  users : UserGet[] = [];
  dataLogin:any[]=[];
  image_bigin : String = '';
  mistake : string = '';
  signerr : string = '';
  data: any;
  datapic:any[] = [];

  constructor(private constants : Constants,private http : HttpClient,private formBuilder: FormBuilder,private sanitizer: DomSanitizer,private ActivatedRoute: ActivatedRoute,private router: Router){}
  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe(params => {
      this.data = window.history.state.data;
      console.log(this.data[0]);
      this.scoreseven();
    });
  }
  scoreYesterday:any;
  // scoreYesterday:any[] = [];
  scoreseven(){
    console.log(this.data[0].username);
    
    const url = this.constants.API_ENDPOINT + '/user/score/seven?username='+this.data[0].username;
    console.log(url);
    
    this.http.get(url).subscribe((stat: any) => {
      console.log(stat);
      
      this.scoreYesterday = stat;
      // for(let i=0;i<this.scoreYesterday.length;i++){
      //   this.scoreYesterday[i].url_image = this.constants.API_ENDPOINT+stat[i].url_image;
      //   //console.log(this.randompic[i]);
        
      // }
      this.createCharts();
      console.log(this.scoreYesterday); // แสดงฟังก์ชัน randomimage
    });
  }

  // printScore(){
  //   const urlall = this.constants.API_ENDPOINT+'/user/manage/yourimage?username='+this.data[0].username;
  //   console.log(urlall);
  //   const requests:any[] = [];
  //   this.http.get(urlall).subscribe((picall: any) => {
  //     console.log(picall);
  //     console.log(picall.length);
  //     this.datapic = picall;
  //     for(let i=0;i<this.datapic.length;i++){
  //       this.datapic[i].url_image = this.constants.API_ENDPOINT+picall[i].url_image;
  //       console.log(this.datapic[i]); 
  //       const urltoday = this.constants.API_ENDPOINT+'/user/yesterday/score?id_image='+this.datapic[i].id_image;
  //       console.log(urltoday);
  //       this.http.get(urltoday).subscribe((today: any) => {
  //         requests.push(this.http.get(urltoday));
  //         this.scoreYesterday = today.yesterdayScore[0].score_day;
  //         // this.scoreYesterday = today.yesterdayScore.score_day;
  //         console.log(this.scoreYesterday);
  //         console.log(today);
  //       });
  //     }

  //     forkJoin(requests).subscribe((responses: any[]) => {
  //       console.log(responses);
  //       const combinedData = [];
  //       for (let i = 0; i < responses.length; i++) {
  //         combinedData.push({
  //           id_image: this.datapic[i].id_image,
  //           score_day: responses[i].length
  //         });
  //       }
  //       console.log(combinedData);
  //     });


  //   });
  // }
  goback(){
    window.history.back();
  }
  colorgraph(){
    const r = Math.floor(Math.random() *256);
    const g = Math.floor(Math.random() *256);
    const b = Math.floor(Math.random() *256);
    const color = '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
    return color;
  }
  createChartData(votes: any[]): any {
    const maxDate = new Date();
    const minDate = new Date(maxDate);
    minDate.setDate(maxDate.getDate() - 6); // นับย้อนหลัง 7 วัน
  
    const labels = [];
    const data = [];
  
    for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
      labels.push(currentDate.toISOString().slice(0, 10));
  
      const vote = votes.find(v => v.day.slice(0, 10) === currentDate.toISOString().slice(0, 10));
      if (vote) {
        data.push(vote.score_day);
      } else {
        data.push(null); // ใส่ค่า null ในกรณีที่ไม่มีข้อมูลในวันนั้น
      }
    }
    return { labels, data };
  }
  

  createCharts(): void {
    this.scoreYesterday.forEach((ImageID: any) => {
      const chartData = this.createChartData(ImageID.vote);
      
      // สร้าง canvas element สำหรับแต่ละรูปภาพ
      const container = document.createElement('div');
      container.style.display = 'block';
      container.style.marginTop = '-10%';
      container.style.width = '700px';
      container.style.height = '500px';
      container.style.marginLeft = '50px';
      // container.style.backgroundColor='white';
      
      const canvas = document.createElement('canvas');
      canvas.id = 'myChart-' + ImageID.id_image;
      container.appendChild(canvas);
  
      // เพิ่ม canvas เข้าไปใน DOM
      const chartContainer = document.getElementById('chartContainer');
      if (chartContainer) {
        chartContainer.appendChild(container);
      }
  
      // สร้างกราฟใน canvas ของแต่ละรูปภาพ
      const ctx = canvas as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Score',
          data: chartData.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            // grid: {
            //   color: 'white' // ตั้งค่าสีของเส้นกริดให้เป็นสีขาว
            // },
            ticks: {
              color: 'black' // กำหนดสีของ labels เป็นสีขาว
            },
            beginAtZero: true
          },
          
          x: {
            // grid: {
            //   color: 'white' // ตั้งค่าสีของเส้นกริดให้เป็นสีขาว
            // }
            ticks: {
              color: 'black' // กำหนดสีของ labels เป็นสีขาว
            }
          },
          
        }
      }
    });
    });
  }
}
