import { Routes } from '@angular/router';
import { VoteComponent } from './pages/vote/vote.component';
import { UserlogComponent } from './pages/userlog/userlog.component';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { UploadedComponent } from './pages/uploaded/uploaded.component';
import { MainadminComponent } from './pages/mainadmin/mainadmin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatComponent } from './pages/stat/stat.component';
import { UsersignComponent } from './pages/usersign/usersign.component';
import { StattopComponent } from './pages/stattop/stattop.component';

export const routes: Routes = [
    {path: '', component: VoteComponent },
    {path: 'userlog', component: UserlogComponent },
    // {path: 'toolbar', component: ToolbarComponent },
    {path: 'uploaded', component: UploadedComponent },
    {path: 'mainadmin', component: MainadminComponent },
    {path: 'profile', component: ProfileComponent },
    {path: 'stat', component: StatComponent },
    {path: 'usersign', component: UsersignComponent },
    {path: 'stattop', component: StattopComponent },
];
