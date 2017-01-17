var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { GithubService } from "../github.service";
export var IndexComponent = (function () {
    function IndexComponent(gith, router, route) {
        var _this = this;
        this.gith = gith;
        this.router = router;
        this.route = route;
        this.path = Array();
        this.tree = Array();
        // get site names
        this.gith.getSites().subscribe(function (res) {
            var localsites = [];
            res.forEach(function (item) { localsites.push(item.name); });
            _this.tree[0] = localsites;
        });
    }
    IndexComponent.prototype.ngOnInit = function () {
    };
    IndexComponent.prototype.getFiles = function (level, file) {
        var _this = this;
        // update path
        this.path[level] = file;
        // removing subpath
        this.path = this.path.slice(0, level + 1);
        this.tree = this.tree.slice(0, level + 1);
        // convert path array to single string
        var str_path = this.path.join('/');
        if (file.includes(".json")) {
            this.router.navigate(this.path, { relativeTo: this.route });
        }
        else {
            this.gith.getFiles(str_path).subscribe(function (res) {
                var localfiles = [];
                res.forEach(function (item) { localfiles.push(item.name); });
                _this.tree[level + 1] = localfiles;
            });
        }
    };
    __decorate([
        ViewChild('chartContainer'), 
        __metadata('design:type', ElementRef)
    ], IndexComponent.prototype, "chartContainer", void 0);
    IndexComponent = __decorate([
        Component({
            selector: 'app-index',
            templateUrl: './index.component.html',
            styleUrls: ['./index.component.css']
        }), 
        __metadata('design:paramtypes', [GithubService, Router, ActivatedRoute])
    ], IndexComponent);
    return IndexComponent;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/index/index.component.js.map