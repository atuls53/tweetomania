import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBoardComponent } from './components/search-board/search-board.component';

const routes: Routes = [
  { path:'', redirectTo:'search', pathMatch:'full'},
  { path:'search', component: SearchBoardComponent},
  { path:'**', redirectTo:'search', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
