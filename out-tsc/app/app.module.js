var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GithubService } from './github.service';
import { AppComponent } from './app.component';
import { BarChartComponent } from './barchart/barchart.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexComponent } from './index/index.component';
import { PdrComponent } from './pdr/pdr.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MotemapComponent } from './motemap/motemap.component';
import { DatasetSelectorComponent } from './dataset-selector/dataset-selector.component';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                BarChartComponent,
                IndexComponent,
                PdrComponent,
                MotemapComponent,
                DatasetSelectorComponent
            ],
            imports: [
                BrowserModule,
                FormsModule,
                HttpModule,
                AppRoutingModule,
                ChartsModule
            ],
            providers: [GithubService],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/app.module.js.map