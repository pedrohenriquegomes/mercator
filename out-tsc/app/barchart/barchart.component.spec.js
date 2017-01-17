import { async, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './barchart.component';
describe('BarChartComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [BarChartComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/barchart/barchart.component.spec.js.map