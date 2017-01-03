"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var PdrComponent = (function () {
    function PdrComponent(route, gith) {
        var _this = this;
        this.route = route;
        this.gith = gith;
        this.site = "";
        this.types = [];
        this.route.params.subscribe(function (params) {
            _this.site = params['city'];
            _this.gith.getTypes(params['city']).subscribe(function (res) {
                _this.types = res;
            });
        });
    }
    PdrComponent.prototype.ngOnInit = function () {
    };
    PdrComponent = __decorate([
        core_1.Component({
            selector: 'app-pdr',
            templateUrl: './pdr.component.html',
            styleUrls: ['./pdr.component.css']
        })
    ], PdrComponent);
    return PdrComponent;
}());
exports.PdrComponent = PdrComponent;
