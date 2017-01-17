import { async, TestBed } from '@angular/core/testing';
import { PdrComponent } from './pdr.component';
describe('PdrComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PdrComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PdrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/pdr/pdr.component.spec.js.map