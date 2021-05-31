import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatasetId } from '../../../../models/dataset-id.enum';

@Component({
  selector: 'dh-rank-viewer-filters',
  templateUrl: './rank-viewer-filters.component.html',
  styleUrls: ['./rank-viewer-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankViewerFiltersComponent implements OnInit {
  @Input() selectedId: DatasetId | null = null;
  @Input() datasetIds: DatasetId[] | null = [];
  @Input() customDateRange: object = {};
  @Output() datasetSelect: EventEmitter<DatasetId> = new EventEmitter<DatasetId>();

  constructor() { }

  ngOnInit(): void {
  }

  onDatasetClick(datasetId: string) {
    this.datasetSelect.emit(datasetId as DatasetId);
  }

}
