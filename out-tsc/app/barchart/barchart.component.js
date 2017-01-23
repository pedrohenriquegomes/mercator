var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { GithubService } from '../github.service';
export var BarChartComponent = (function () {
    function BarChartComponent(gith) {
        this.gith = gith;
        this.result = [];
        this.barChartOptions = {
            responsive: true,
            scales: {},
        };
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [{ data: [], label: '' }];
    }
    BarChartComponent.prototype.ngOnChanges = function (changes) {
        if ("exp_type" in changes &&
            changes["exp_type"].currentValue != undefined &&
            changes["exp_type"].currentValue != "") {
            this.load_chart_config();
        }
        this.load_graph();
    };
    ;
    // events
    BarChartComponent.prototype.chartClicked = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.chartHovered = function (e) {
        //console.log(e);
    };
    BarChartComponent.prototype.reload_chart = function () {
        var _this = this;
        this.barChartData = [{ data: [], label: '' }];
        if (this.barChartOptions.scales.xAxes != undefined &&
            this.barChartOptions.scales.xAxes[0].type == "linear") {
            this.result.forEach(function (item) {
                if (item.x.length > 0) {
                    // format graph data
                    var data_list = [];
                    for (var i = 0; i < item.x.length; i++) {
                        data_list.push({ x: item.x[i], y: item.y[i] });
                    }
                    _this.barChartData.push({ data: data_list, label: item.ytitle + " over " + item.xtitle });
                }
            });
        }
        else {
            this.result.forEach(function (item) {
                _this.barChartData.push({ data: item.y, label: item.ytitle + " over " + item.xtitle });
                _this.barChartLabels = item.x;
            });
        }
    };
    BarChartComponent.prototype.load_chart_config = function () {
        var _this = this;
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/";
        var url_args = [this.site, this.date, this.exp, this.exp_type];
        this.gith.download_url(url + url_args.join("/") + "/" + "chart_config.json").subscribe(function (res) {
            _this.barChartOptions = Object.assign({}, _this.barChartOptions, res.ChartOptions);
            _this.barChartType = res.ChartType;
        }, function (error) { console.log("Can not find chart option file."); });
    };
    BarChartComponent.prototype.load_graph = function () {
        var _this = this;
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/";
        var url_args = [this.site, this.date, this.exp, this.exp_type];
        this.result = [];
        if (this.exp_type == "one_to_one") {
            var _loop_1 = function(i) {
                var url_args_full = url_args.concat(this_1.src_mac, this_1.dst_mac_list[i]);
                if (this_1.exp == "pdr_time") {
                    this_1.gith.getFiles(url_args_full.join('/')).subscribe(function (res) {
                        res.forEach(function (f) {
                            _this.gith.download_url(url + url_args_full.join('/') + "/" + f.name).subscribe(function (res) {
                                _this.result.push(res);
                                _this.reload_chart();
                            });
                        });
                    });
                }
                else {
                    this_1.gith.download_url(url + url_args_full.join('/') + ".json").subscribe(function (res) {
                        _this.result.push(res);
                        _this.reload_chart();
                    });
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.dst_mac_list.length; i++) {
                _loop_1(i);
            }
        }
        else if (this.exp_type == "one_to_many") {
            if (this.src_mac != "") {
                var url_args_full = url_args.concat(this.src_mac);
                this.gith.download_url(url + url_args_full.join('/') + ".json").subscribe(function (res) {
                    _this.result.push(res);
                    _this.reload_chart();
                });
            }
        }
        else if (this.exp_type == "many_to_many") {
            this.gith.download_url(url + url_args.join("/") + "/" + this.exp + ".json").subscribe(function (res) {
                _this.result.push(res);
                _this.reload_chart();
            });
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "site", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "date", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "exp", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "exp_type", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "src_mac", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], BarChartComponent.prototype, "dst_mac_list", void 0);
    BarChartComponent = __decorate([
        Component({
            selector: 'app-barchart',
            templateUrl: './barchart.component.html',
            styleUrls: ['./barchart.component.css']
        }), 
        __metadata('design:paramtypes', [GithubService])
    ], BarChartComponent);
    return BarChartComponent;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/barchart/barchart.component.js.map