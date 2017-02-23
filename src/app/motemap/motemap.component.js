"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var MotemapComponent = (function () {
    function MotemapComponent(gith) {
        this.gith = gith;
        this.circles = [];
        this.src_mac = "";
        this.dst_mac_list = [];
        this.COLOR_ENABLED = "black";
        this.COLOR_DISABLED = "grey";
    }
    MotemapComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if ("site" in changes) {
            this.draw_nodes();
        }
        if ("exp" in changes) {
            this.src_mac = "";
            this.dst_mac_list = [];
            this.exp_type = "many_to_many";
            this.circles.forEach(function (item) {
                item.color = _this.COLOR_ENABLED;
            });
        }
    };
    MotemapComponent.prototype.ngAfterViewInit = function () { };
    MotemapComponent.prototype.draw_nodes = function () {
        var _this = this;
        var newcircles = [];
        var url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/metas/" + this.site + ".json";
        this.gith.download_url(url).subscribe(function (res) {
            res.forEach(function (node) {
                if (node.mac) {
                    newcircles.push({ x: node.x, y: node.y, msg: node.mac, color: _this.COLOR_DISABLED });
                }
            });
        });
        this.circles = newcircles;
    };
    MotemapComponent.prototype.node_clicked = function (circle_id, msg) {
        var _this = this;
        if (this.src_mac == "") {
            // new src mac
            this.src_mac = msg;
            this.circles.forEach(function (item) {
                item.color = _this.COLOR_ENABLED;
            });
            this.circles[circle_id].color = "red";
            this.exp_type = "one_to_many";
        }
        else if (this.src_mac == msg) {
            // cancel src mac
            this.circles.forEach(function (item) {
                item.color = _this.COLOR_ENABLED;
            });
            this.dst_mac_list = [];
            this.src_mac = "";
            this.exp_type = "many_to_many";
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
                this.circles[circle_id].color = this.COLOR_ENABLED;
            }
            else {
                // new dst_mac
                this.dst_mac_list.push(msg);
                this.circles[circle_id].color = "green";
            }
            this.dst_mac_list = this.dst_mac_list.slice(); // update reference
            this.exp_type = "one_to_one";
        }
    };
    __decorate([
        core_1.Input()
    ], MotemapComponent.prototype, "site", void 0);
    __decorate([
        core_1.Input()
    ], MotemapComponent.prototype, "date", void 0);
    __decorate([
        core_1.Input()
    ], MotemapComponent.prototype, "exp", void 0);
    __decorate([
        core_1.ViewChild("myCanvas")
    ], MotemapComponent.prototype, "myCanvas", void 0);
    MotemapComponent = __decorate([
        core_1.Component({
            selector: 'app-motemap',
            templateUrl: './motemap.component.html',
            styleUrls: ['./motemap.component.css']
        })
    ], MotemapComponent);
    return MotemapComponent;
}());
exports.MotemapComponent = MotemapComponent;
