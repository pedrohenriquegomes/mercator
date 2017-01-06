"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var BarChartComponent = (function () {
    function BarChartComponent(route, gith) {
        var _this = this;
        this.route = route;
        this.gith = gith;
        this.site = "";
        this.macs = [];
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
                yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                        }
                    }]
            }
        };
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: [], label: '' },
        ];
        this.route.params.subscribe(function (params) {
            var site = params['city'];
            _this.site = site;
            var exp = params['exp'];
            var x2x = params['x2x'];
            _this.barChartData[0]['label'] = exp;
            if (params['mac']) {
                _this.readJSON();
            }
            _this.gith.getMacs(site, exp, x2x).subscribe(function (res) {
                _this.macs = res;
            });
        });
    }
    // events
    BarChartComponent.prototype.chartClicked = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.chartHovered = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.ngOnInit = function () {
    };
    BarChartComponent.prototype.getExps = function (site) {
        var _this = this;
        this.gith.getExps(site).subscribe(function (res) {
            var localexp = [];
            res.forEach(function (item) {
                localexp.push(item.name);
            });
            _this.exps = localexp;
        });
    };
    BarChartComponent.prototype.readJSON = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            console.log(_this.route.snapshot.url.join('/'));
            var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/develop/datasets/processed/";
            _this.gith.download_url(url + _this.route.snapshot.url.join('/') + "?ref=develop").subscribe(function (res) {
                _this.barChartLabels = res.x;
                _this.barChartData = [
                    { data: res.y, label: res.ytitle },
                    {
                        label: "Sales",
                        type: 'line',
                        data: [51, 65, 40, 49, 60, 37, 40],
                        fill: false,
                        yAxisID: 'y-axis-2'
                    }
                ];
            });
        });
    };
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
