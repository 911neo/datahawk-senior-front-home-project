import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges} from "@angular/core";
import { ProductRank } from "../../../../models/product-rank.type";
import { ChartDataSets, Chart, ChartOptions } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";
import * as moment from "moment";
import { Product } from "../../../../models/product.interface";
import { DaterangepickerConfig } from "ng2-daterangepicker";

@Component({
  selector: "dh-rank-viewer-chart",
  templateUrl: "./rank-viewer-chart.component.html",
  styleUrls: ["./rank-viewer-chart.component.scss"],
})
export class RankViewerChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective, { static: true }) chart!: BaseChartDirective;
  @Input() selectedDataset: ProductRank[] | null = [];
  @Input() chartOptions: ChartOptions = {};
  updatedDataSets: ProductRank[] = [];
  searchValueByRank: number = 0;
  searchValueByRating: number = 0;
  searchValueByPrice: number = 0;
  chartData: ChartDataSets[] = [];
  clonedCharData: ChartDataSets[] = [];
  chartLabels: Label[] = [];

  constructor(private daterangepickerOptions: DaterangepickerConfig) {
    this.daterangepickerOptions.settings = {
      locale: { format: "YYYY-MM-DD" },
      alwaysShowCalendars: false,
      opens: "right",
      ranges: {
        "Last Month": [moment().subtract(1, "month"), moment()],
        "Last 3 Months": [moment().subtract(4, "month"), moment()],
        "Last 6 Months": [moment().subtract(6, "month"), moment()],
        "Last 12 Months": [moment().subtract(12, "month"), moment()],
      },
    };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.selectedDataset.currentValue) {
      this.updateChartOptions();
    }
  }

  updateChartOptions() {
    this.chartLabels = this.getLabels();
    this.chartData = this.getData();
    this.clonedCharData = this.getData();
  }

  getLabels(): string[] {
    const dates: string[] = Array.from(
      new Set(this.selectedDataset?.map((r: ProductRank) => r.date))
    );

    return dates
      .map((d) => moment(d, "MM/DD/YYYY").utc(true))
      .sort((a, b) => (a.isAfter(b) ? 1 : -1))
      .map((d) => d.toISOString());
  }

  getData(): ChartDataSets[] {
    const productASINs = Array.from(
      new Set(this.selectedDataset?.map((r: ProductRank) => r.ASIN)) ?? []
    );
    const data: ChartDataSets[] = [];

    for (const ASIN of productASINs) {
      const product: Product | null = this.getProduct(ASIN);

      if (!product) {
        continue;
      }

      data.push({
        data: this.getProductData(product),
        label: product.name,
        fill: false,
      });
    }

    return data;
  }

  getProduct(ASIN: string): ProductRank | null {
    return this.selectedDataset?.find((p) => p.ASIN === ASIN) ?? null;
  }

  getProductData(product: Product): Array<number | null> {
    const productData: Array<number | null> = [];

    for (const day of this.chartLabels) {
      const dayData = this.getProductRankByDay(product, day as string);

      productData.push(dayData?.rank ?? null);
    }

    return productData;
  }

  getProductRankByDay(product: Product, date: string): ProductRank | null {
    const formattedDate: string = moment(date).utc(true).format("MM/DD/YYYY");

    return (
      this.selectedDataset?.find(
        (p) => p.ASIN === product.ASIN && p.date === formattedDate
      ) ?? null
    );
  }

  customDateRange(startDate: string, endDate: string) {
    const chartDatafilteredset: Array<ChartDataSets> = [];
    this.chartData = this.clonedCharData;

    let result = this.selectedDataset?.map((x) => Object.assign({},x,
        this.selectedDataset?.filter((data) => {
          return data.date >= startDate && data.date <= endDate;
        })
      )
    );

    const rangeData = result?.filter((data) => {
      return data.date >= startDate && data.date <= endDate;
    });

    const chartDatafiltered = rangeData?.filter((data) => {
      this.chartData.forEach(function (value): void {
        if (
          data.name === value.label &&
          chartDatafilteredset.indexOf(value) == -1
        )
          chartDatafilteredset.push(value);
      });
    });

    this.chartData = chartDatafilteredset!;
  }

  getProductByRank(searchValue: number, groupValue: string) {
    const chartDatafilteredset: Array<ChartDataSets> = [];
    this.chartData = this.clonedCharData;

    const result = this.selectedDataset?.map((x) => Object.assign({},x,
        this.selectedDataset?.filter((y) => y.rank == searchValue)));

    const rangeData = result?.filter((data) => {
      return groupValue === "less"
        ? data.rank < searchValue
        : data.rank > searchValue;
    });

    console.log(rangeData);

    const chartDatafiltered = rangeData?.filter((data) => {
      this.chartData.forEach(function (value): void {
        if (
          data.name === value.label &&
          chartDatafilteredset.indexOf(value) == -1
        )
          chartDatafilteredset.push(value);
      });
    });

    this.chartData = chartDatafilteredset!;
  }

  getProductByRating(searchValue: number, groupValue: string) {
    const chartDatafilteredset: Array<ChartDataSets> = [];
    this.chartData = this.clonedCharData;

    const result = this.selectedDataset?.map((x) => Object.assign({},x,
          this.selectedDataset?.filter((y) => y.rating == searchValue)));

    const rangeData = result?.filter((data) => {
      return groupValue === "less"
        ? data.rating! < searchValue
        : data.rating! > searchValue;
    });

    const chartDatafiltered = rangeData?.filter((data) => {
      this.chartData.forEach(function (value): void {
        if (
          data.name === value.label &&
          chartDatafilteredset.indexOf(value) == -1
        )
          chartDatafilteredset.push(value);
      });
    });

    this.chartData = chartDatafilteredset!;
  }

  getProductByPrice(searchValue: number, groupValue: string) {
    const chartDatafilteredset: Array<ChartDataSets> = [];
    this.chartData = this.clonedCharData;

    const result = this.selectedDataset?.map((x) => Object.assign({},x,
          this.selectedDataset?.filter((y) => y.price == searchValue)));

    const rangeData = result?.filter((data) => {
      return  groupValue === "less" 
        ? data.price! < searchValue 
        : data.price! > searchValue;
    });

    console.log(rangeData);
    

    const chartDatafiltered = rangeData?.filter((data) => {
      this.chartData.forEach(function (value): void {
        if (
          data.name === value.label &&
          chartDatafilteredset.indexOf(value) == -1
        )
          chartDatafilteredset.push(value);
      });
    });

    this.chartData = chartDatafilteredset!;
  }

  public chosenDate: any = {
    start: moment().subtract(12, "month"),
    end: moment().subtract(6, "month"),
  };

  public picker1 = {
    opens: "left",
    startDate: moment().subtract(5, "day"),
    endDate: moment(),
    isInvalidDate: function (date: any) {
      if (date.isSame("2017-09-26", "day")) return "mystyle";
      return false;
    },
  };

  public selectedDate(value: any, dateInput: any): void {
    console.log(value);
    dateInput.start = value.start;
    dateInput.end = value.end;
  }

  public calendarEventsHandler(e: any): void {
    console.log({ calendarEvents: e });
  }

  public applyDatepicker(e: any) {
    console.log(e);
    const startD = e.picker.startDate.format("MM/DD/YYYY");
    const endD = e.picker.endDate.format("MM/DD/YYYY");
    console.log({ applyDatepicker: e });
    console.log("startD", startD);
    console.log("endD", endD);
    const chart = this.chart;
    this.customDateRange(startD, endD);
  }

  public updateSettings(): void {
    this.daterangepickerOptions.settings.locale = { format: "YYYY/MM/DD" };
    this.daterangepickerOptions.settings.ranges = {
      "30 days ago": [moment().subtract(1, "month"), moment()],
      "3 months ago": [moment().subtract(4, "month"), moment()],
      "6 months ago": [moment().subtract(6, "month"), moment()],
      "7 months ago": [moment().subtract(12, "month"), moment()],
    };
  }
}
