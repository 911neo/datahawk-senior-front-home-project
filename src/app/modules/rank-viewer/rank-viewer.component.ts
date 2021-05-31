import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CHART_OPTIONS } from '../../models/chart-options';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../state/app.state';
import { Observable } from 'rxjs';
import { ProductRank } from '../../models/product-rank.type';
import { ChartOptions } from 'chart.js';
import { DatasetId } from '../../models/dataset-id.enum';
import { AppActions } from '../../state/app.actions';
import { ChartDataSets, Chart } from 'chart.js';
import { Label ,BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'dh-rank-viewer',
  templateUrl: './rank-viewer.component.html',
  styleUrls: ['./rank-viewer.component.scss']
})
export class RankViewerComponent implements OnInit {
  
  // @ts-ignore
  @Select(AppState.selectedDataset) selectedDataset$: Observable<ProductRank[]>;
 
  // @ts-ignore
  @Select(AppState.selectedDatasetId) selectedDatasetId$: Observable<DatasetId>;

  chartsOptions: ChartOptions = CHART_OPTIONS;
  chartObject: object = Chart;
  datasetIds: DatasetId[] = Object.values(DatasetId);

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
  }

  onDatasetSelection(datasetId: DatasetId) {
    this.store.dispatch(new AppActions.SelectDataset(datasetId));
  }

}
