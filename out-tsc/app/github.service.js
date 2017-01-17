var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export var GithubService = (function () {
    function GithubService(_http) {
        this._http = _http;
        this.b_url = "https://api.github.com/repos/openwsn-berkeley/mercator/contents/datasets/processed";
    }
    GithubService.prototype.getSites = function () {
        var url = this.b_url + "?ref=data";
        return this._http.get(url)
            .map(function (r) { return r.json(); });
    };
    GithubService.prototype.getExps = function (site) {
        var url = this.b_url + "/" + site + "?ref=data";
        return this._http.get(url)
            .map(function (r) { return r.json(); });
    };
    GithubService.prototype.getTypes = function (site, exp) {
        var url = this.b_url + "/" + site + "/" + exp + "?ref=data";
        return this._http.get(url)
            .map(function (r) { return r.json(); });
    };
    GithubService.prototype.getMacs = function (site, exp, type) {
        var url = this.b_url + "/" + site + "/" + exp + "/" + type + "?ref=data";
        return this._http.get(url)
            .map(function (r) { return r.json(); });
    };
    GithubService.prototype.getFiles = function (url) {
        return this._http.get(this.b_url + "/" + url + "?ref=data").map(function (r) { return r.json(); });
    };
    GithubService.prototype.download_url = function (url) {
        return this._http.get(url).map(function (r) { return r.json(); });
    };
    GithubService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], GithubService);
    return GithubService;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/github.service.js.map