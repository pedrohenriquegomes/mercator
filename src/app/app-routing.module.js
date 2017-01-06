/**
 * Created by malba on 30-12-16.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var barchart_component_1 = require('./barchart/barchart.component');
var index_component_1 = require('./index/index.component');
var pdr_component_1 = require('./pdr/pdr.component');
var routes = [
    { path: '', component: index_component_1.IndexComponent },
    { path: 'city/:city/pdr', component: pdr_component_1.PdrComponent },
    { path: 'city/pdr/:pdr', component: barchart_component_1.BarChartComponent },
    { path: ':city/:exp/:x2x', pathMatch: 'full', component: barchart_component_1.BarChartComponent },
    { path: ':city/:exp/:x2x/:mac', pathMatch: 'full', component: barchart_component_1.BarChartComponent },
    { path: ':city/:exp/:x2x/:mactx/:mac', pathMatch: 'full', component: barchart_component_1.BarChartComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
