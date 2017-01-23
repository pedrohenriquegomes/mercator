var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input } from '@angular/core';
import { GithubService } from "../github.service";
import { ActivatedRoute } from "@angular/router";
export var MotemapComponent = (function () {
    function MotemapComponent(gith, route) {
        var _this = this;
        this.gith = gith;
        this.route = route;
        this.circles = [];
        this.src_mac = "";
        this.dst_mac_list = [];
        this.COLOR_DEFAULT = "black";
        this.route.params.subscribe(function (params) {
            _this.site = params['site'];
            _this.date = params['date'];
            _this.exp = params['exp'];
            _this.exp_type = params['type'];
            if ("site" in params) {
                var newcircles_1 = [];
                var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/metas/" + _this.site + ".json";
                _this.gith.download_url(url).subscribe(function (res) {
                    res.forEach(function (node) {
                        if (node.mac) {
                            newcircles_1.push({ x: node.x, y: node.y, msg: node.mac, color: _this.COLOR_DEFAULT });
                        }
                    });
                });
                _this.circles = newcircles_1;
            }
        });
    }
    MotemapComponent.prototype.ngOnChanges = function (changes) {
        if ("exp" in changes || "exp_type" in changes) {
            this.src_mac = "";
            this.dst_mac_list = [];
        }
    };
    MotemapComponent.prototype.ngAfterViewInit = function () { };
    MotemapComponent.prototype.boom = function (circle_id, msg) {
        var _this = this;
        if (this.exp_type == "one_to_one") {
            if (this.src_mac == "") {
                // new src mac
                this.src_mac = msg;
                this.circles.forEach(function (item) {
                    item.color = _this.COLOR_DEFAULT;
                });
                this.circles[circle_id].color = "red";
            }
            else if (this.src_mac == msg) {
                // cancel src mac
                this.circles.forEach(function (item) {
                    item.color = _this.COLOR_DEFAULT;
                });
                this.dst_mac_list = [];
                this.src_mac = "";
            }
            else {
                var found = -1;
                for (var i = this.dst_mac_list.length - 1; i >= 0; i--) {
                    if (this.dst_mac_list[i] === msg) {
                        found = i;
                        break;
                    }
                }
                if (found != -1) {
                    // cancel dst_mac
                    this.dst_mac_list.splice(found, 1);
                    this.circles[circle_id].color = this.COLOR_DEFAULT;
                }
                else {
                    // new dst_mac
                    this.dst_mac_list.push(msg);
                    this.circles[circle_id].color = "green";
                }
                this.dst_mac_list = this.dst_mac_list.slice(); // update reference
            }
        }
        else if (this.exp_type == "one_to_many") {
            // remove existing srcmac
            this.circles.forEach(function (item) {
                item.color = _this.COLOR_DEFAULT;
            });
            // new src mac
            this.src_mac = msg;
            this.circles.forEach(function (item) {
                item.color = _this.COLOR_DEFAULT;
            });
            this.circles[circle_id].color = "red";
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MotemapComponent.prototype, "site", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MotemapComponent.prototype, "date", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MotemapComponent.prototype, "exp", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MotemapComponent.prototype, "exp_type", void 0);
    __decorate([
        ViewChild("myCanvas"), 
        __metadata('design:type', Object)
    ], MotemapComponent.prototype, "myCanvas", void 0);
    MotemapComponent = __decorate([
        Component({
            selector: 'app-motemap',
            templateUrl: './motemap.component.html',
            styleUrls: ['./motemap.component.css']
        }), 
        __metadata('design:paramtypes', [GithubService, ActivatedRoute])
    ], MotemapComponent);
    return MotemapComponent;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/motemap/motemap.component.js.map