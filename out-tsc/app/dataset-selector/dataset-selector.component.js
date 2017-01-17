var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { GithubService } from "../github.service";
import { Router } from "@angular/router";
export var DatasetSelectorComponent = (function () {
    function DatasetSelectorComponent(gith, router) {
        this.gith = gith;
        this.router = router;
        this.dataset_list = [];
    }
    DatasetSelectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gith.getSites().subscribe(function (res) {
            res.forEach(function (site) {
                _this.gith.getFiles(site.name).subscribe(function (res1) {
                    res1.forEach(function (file) {
                        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/datasets/processed/" +
                            site.name + "/" + file.name + "/info.json";
                        _this.gith.download_url(url).subscribe(function (res2) {
                            res2.site = site.name;
                            res2.date = file.name;
                            _this.dataset_list.push(res2);
                        });
                    });
                });
            });
        });
    };
    DatasetSelectorComponent.prototype.redirect = function (site, date) {
        this.router.navigate(["site", site, date]);
    };
    DatasetSelectorComponent = __decorate([
        Component({
            selector: 'app-dataset-selector',
            templateUrl: './dataset-selector.component.html',
            styleUrls: ['./dataset-selector.component.css']
        }), 
        __metadata('design:paramtypes', [GithubService, Router])
    ], DatasetSelectorComponent);
    return DatasetSelectorComponent;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/dataset-selector/dataset-selector.component.js.map