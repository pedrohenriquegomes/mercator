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
import { Router, ActivatedRoute } from "@angular/router";
export var DatasetSelectorComponent = (function () {
    function DatasetSelectorComponent(gith, router, route) {
        var _this = this;
        this.gith = gith;
        this.router = router;
        this.route = route;
        this.exp_list = [];
        this.type_list = [];
        this.site = "";
        this.date = "";
        this.exp = "";
        this.exp_type = "";
        // get route parameters
        this.route.params.subscribe(function (params) {
            if ("site" in params) {
                _this.site = params['site'];
                if ("date" in params) {
                    _this.get_exp_list(_this.site, params['date']);
                }
                if ("exp" in params) {
                    _this.get_type_list(params['exp']);
                }
                _this.exp_list = [];
                _this.type_list = [];
            }
            _this.get_dataset_list();
        });
    }
    DatasetSelectorComponent.prototype.ngOnInit = function () { };
    DatasetSelectorComponent.prototype.get_dataset_list = function () {
        var _this = this;
        this.dataset_list = [];
        this.gith.getSites().subscribe(function (res) {
            res.forEach(function (site) {
                if (_this.site == "" || _this.site == site.name) {
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
                }
            });
        });
    };
    DatasetSelectorComponent.prototype.get_exp_list = function (site, date) {
        var _this = this;
        this.site = site;
        this.date = date;
        this.gith.getExps(site, date).subscribe(function (res) {
            _this.exp_list = [];
            res.forEach(function (exp) {
                if (exp.type == "dir") {
                    _this.exp_list.push(exp.name);
                }
            });
        });
    };
    DatasetSelectorComponent.prototype.get_type_list = function (exp) {
        var _this = this;
        this.exp = exp;
        this.gith.getTypes(this.site, this.date, exp).subscribe(function (res) {
            _this.type_list = [];
            res.forEach(function (exptype) {
                if (exptype.type == "dir") {
                    _this.type_list.push(exptype.name);
                }
            });
        });
    };
    DatasetSelectorComponent.prototype.get_graph = function (exp_type) {
        var url = [this.site, this.date, this.exp, exp_type];
        this.exp_type = exp_type;
    };
    DatasetSelectorComponent = __decorate([
        Component({
            selector: 'app-dataset-selector',
            templateUrl: './dataset-selector.component.html',
            styleUrls: ['./dataset-selector.component.css']
        }), 
        __metadata('design:paramtypes', [GithubService, Router, ActivatedRoute])
    ], DatasetSelectorComponent);
    return DatasetSelectorComponent;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/dataset-selector/dataset-selector.component.js.map