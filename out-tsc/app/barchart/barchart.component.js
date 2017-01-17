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
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
        };
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: [], label: '' },
        ];
    }
    BarChartComponent.prototype.ngOnChanges = function () {
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
    BarChartComponent.prototype.load_graph = function () {
        var _this = this;
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/";
        this.barChartData = [{ data: [], label: '' }];
        if (this.exp_type == "one_to_one") {
            if (this.dst_mac_list.length > 0) {
                for (var i = 0; i < this.dst_mac_list.length; i++) {
                    this.gith.download_url(url +
                        this.site + "/" +
                        this.date + "/" +
                        this.exp + "/" +
                        this.exp_type + "/" +
                        this.src_mac + "/" +
                        this.dst_mac_list[i] + ".json").subscribe(function (res) {
                        _this.barChartLabels = res.x;
                        _this.barChartData.push({ data: res.y, label: res.ytitle });
                        console.log(_this.barChartData);
                    });
                }
                ;
            }
        }
        else if (this.exp_type == "many_to_many") {
            this.gith.download_url(url +
                this.site + "/" +
                this.date + "/" +
                this.exp + "/" +
                this.exp + ".json").subscribe(function (res) {
                _this.barChartLabels = res.x;
                _this.barChartData.push({ data: res.y, label: res.ytitle });
                console.log(_this.barChartData);
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