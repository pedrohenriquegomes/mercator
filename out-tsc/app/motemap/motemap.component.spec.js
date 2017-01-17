import { async, TestBed } from '@angular/core/testing';
import { MotemapComponent } from './motemap.component';
describe('MotemapComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [MotemapComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(MotemapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/motemap/motemap.component.spec.js.map