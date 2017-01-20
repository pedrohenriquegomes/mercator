"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var BarChartComponent = (function () {
    function BarChartComponent(gith) {
        this.gith = gith;
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
                xAxes: [{
                        type: 'line',
                        position: 'bottom',
                    }],
                yAxes: [{
                        ticks: { max: 100, min: 0 }
                    }]
            }
        };
        this.barChartLabels = [];
        this.barChartType = 'line';
        this.barChartLegend = true;
        this.barChartData = [];
    }
    BarChartComponent.prototype.ngOnChanges = function () {
        this.load_graph();
    };
    BarChartComponent.prototype.update_graph = function () {
        console.log(this.barChartData);
        var ctx = document.getElementById("chart");
        var myChart = new Chart(ctx, {
            type: this.barChartType,
            data: {
                datasets: this.barChartData
            },
            options: {
                scales: {
                    xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            ticks: { max: 20, min: 0 }
                        }],
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                ticks: { max: 100, min: 0 }
                            }
                        }]
                }
            }
        });
    };
    ;
    // events
    BarChartComponent.prototype.chartClicked = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.chartHovered = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.load_chart_config = function () {
        var _this = this;
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/";
        this.gith.download_url(url +
            this.site + "/" +
            this.date + "/" +
            this.exp + "/" +
            this.exp_type + "/" +
            "chart_config.json").subscribe(function (res) {
            _this.barChartOptions = res.ChartOptions;
            _this.barChartType = res.ChartType;
        });
    };
    BarChartComponent.prototype.load_graph = function () {
        var _this = this;
        //this.load_chart_config();
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/";
        var url_args = [this.site, this.date, this.exp, this.exp_type];
        if (this.exp_type == "one_to_one") {
            if (this.dst_mac_list.length > 0) {
                for (var i = 0; i < this.dst_mac_list.length; i++) {
                    url_args.concat([this.src_mac, this.dst_mac_list[i]]);
                    if (this.exp == "pdr_time") {
                        this.gith.getFiles(url_args.join('/')).subscribe(function (res) {
                            res.forEach(function (f) {
                                _this.gith.download_url(url + url_args.join('/') + "/" + f.name).subscribe(function (res) {
                                    _this.barChartLabels = res.x;
                                    _this.barChartxLabel = res.xtitle;
                                    //this.barChartData.push({x: res.x[0], y: res.y[0]});
                                });
                            });
                        });
                    }
                    else {
                        this.gith.download_url(url + url_args.join('/') + ".json").subscribe(function (res) {
                            _this.barChartLabels = res.x;
                            _this.barChartxLabel = res.xtitle;
                            //this.barChartData.push({data: res.y, label: res.ytitle});
                        });
                    }
                }
            }
        }
        else if (this.exp_type == "many_to_many") {
            this.gith.download_url(url + url_args.join("/") + "/" + this.exp + ".json").subscribe(function (res) {
                _this.barChartxLabel = res.xtitle;
                var data_list = [];
                for (var i = 0; i < res.x.length; i++) {
                    data_list.push({ x: res.x[i], y: res.y[i] });
                }
                _this.barChartData.push({ data: data_list, label: res.ytitle + " over " + res.xtitle });
                _this.update_graph();
            });
        }
    };
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "site", void 0);
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "date", void 0);
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "exp", void 0);
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "exp_type", void 0);
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "src_mac", void 0);
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "dst_mac_list", void 0);
    BarChartComponent = __decorate([
        core_1.Component({
            selector: 'app-barchart',
            templateUrl: './barchart.component.html',
            styleUrls: ['./barchart.component.css']
        })
    ], BarChartComponent);
    return BarChartComponent;
}());
exports.BarChartComponent = BarChartComponent;
