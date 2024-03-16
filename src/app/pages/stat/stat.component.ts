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
import { forkJoin } from 'rxjs';
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
      //console.log(this.data[0]);
      this.scoreseven();
      this.printScore()
    });
  }
  scoreYesterday:any = '';
  scoreseven(){
    const url = this.constants.API_ENDPOINT + '/user/score/seven?username='+this.data[0].username;
    console.log(url);
    
    this.http.get(url).subscribe((stat: any) => {
      console.log(stat);
      
      this.scoreYesterday = stat;
      for(let i=0;i<this.scoreYesterday.length;i++){
        this.scoreYesterday[i].url_image = this.constants.API_ENDPOINT+stat[i].url_image;
        //console.log(this.randompic[i]);
        
      }
      console.log(this.scoreYesterday); // แสดงฟังก์ชัน randomimage
    });
  }
  printScore(){
    const urlall = this.constants.API_ENDPOINT+'/user/manage/yourimage?username='+this.data[0].username;
    console.log(urlall);
    const requests:any[] = [];
    this.http.get(urlall).subscribe((picall: any) => {
      console.log(picall);
      console.log(picall.length);
      this.datapic = picall;
      for(let i=0;i<this.datapic.length;i++){
        this.datapic[i].url_image = this.constants.API_ENDPOINT+picall[i].url_image;
        console.log(this.datapic[i]); 
        const urltoday = this.constants.API_ENDPOINT+'/user/yesterday/score?id_image='+this.datapic[i].id_image;
        console.log(urltoday);
        this.http.get(urltoday).subscribe((today: any) => {
          requests.push(this.http.get(urltoday));
          this.scoreYesterday = today.yesterdayScore[0].score_day;
          console.log(this.scoreYesterday);
          console.log(today);
        });
      }

      forkJoin(requests).subscribe((responses: any[]) => {
        console.log(responses);
        const combinedData = [];
        for (let i = 0; i < responses.length; i++) {
          combinedData.push({
            id_image: this.datapic[i].id_image,
            score_day: responses[i].length
          });
        }
        console.log(combinedData);
      });


    });
  }
  goback(){
    window.history.back();
  }
}
