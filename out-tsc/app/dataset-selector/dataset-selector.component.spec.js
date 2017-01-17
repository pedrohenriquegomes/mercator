import { async, TestBed } from '@angular/core/testing';
import { DatasetSelectorComponent } from './dataset-selector.component';
describe('DatasetSelectorComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DatasetSelectorComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DatasetSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/keoma/Documents/openwsn/mercator_www/src/app/dataset-selector/dataset-selector.component.spec.js.map