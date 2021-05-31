import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankViewerRoutingModule } from './rank-viewer-routing.module';
import { RankViewerChartComponent } from './components/rank-viewer-chart/rank-viewer-chart.component';
import { RankViewerFiltersComponent } from './components/rank-viewer-filters/rank-viewer-filters.component';
import { RankViewerComponent } from './rank-viewer.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { AppMaterialModule } from 'src/app/app.material.module';


@NgModule({
    declarations: [
        RankViewerComponent,
        RankViewerFiltersComponent,
        RankViewerChartComponent,
    ],
    imports: [
        AppMaterialModule,
        CommonModule,
        ChartsModule,
        FormsModule,
        Daterangepicker,
        RankViewerRoutingModule
    ],
    providers: []
})
export class RankViewerModule { }
