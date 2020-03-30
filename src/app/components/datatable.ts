import { Component, Input, Output, EventEmitter, ElementRef,  Inject, Directive, Renderer, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
    selector:   'data-table',
    template:  `
    <div class="dataTables_wrapper form-inline dt-bootstrap no-footer">
    <div *ngIf="refreshTable"><i class="fa fa-refresh fa-spin" style="font-size:24px"></i></div>
    <div class="row">
      
        <div class="col-sm-6">
            <!--<label style="font-size: 20px;" *ngIf="totalItems>0">Found {{totalItems}} Tweets</label>-->
        </div>

        <div class="col-sm-1 pull-right text-right">
        <div class="dataTables_length" id="DataTables_Table_0_length">
            <label>
                <select name="DataTables_Table_0_length" [(ngModel)]="filter.pageSize" (change)="filterChanged(true)" aria-controls="DataTables_Table_0" class="form-control">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </label>
        </div>
    </div>

    </div>
    <div class="row">
        <div class="col-sm-12">
            <ng-content></ng-content>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">Showing <strong>{{(filter.pageIndex - 1) * filter.pageSize + 1}}</strong>-<strong>{{filter.pageIndex * filter.pageSize > totalItems ? totalItems : filter.pageIndex * filter.pageSize}}</strong> of <strong>{{totalItems}}</strong></div>
        </div>
        <div class="col-sm-6 text-right">
            <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                <ngb-pagination [collectionSize]="totalItems" [pageSize]="filter.pageSize" [maxSize]="5" [boundaryLinks]="true" [(page)]="filter.pageIndex" (pageChange)="filterChanged(false)" aria-label="Default pagination"></ngb-pagination>
            </div>
        </div>
    </div>
</div>`  
})

export class DatatableComponent {
    @Input()
    pageSize: number;
    @Input()
    sortField: string;
    @Input()
    sortOrder: number;
    @Input()
    totalItems: number;
    @Output()
    onFilterChange = new EventEmitter();

    filter: any;
    refreshTable: boolean = false;

    ngOnInit() {
        this.filter = { pageIndex: 1, pageSize: 10, searchText: '', sortField: '', sortOrder: 1 };
        if (this.pageSize) this.filter.pageSize = this.pageSize;
        if (this.sortField) this.filter.sortField = this.sortField;
        if (this.sortOrder) this.filter.sortOrder = this.sortOrder;
        this.filterChanged(true);
    }

    filterChanged(refilter) {
        if(refilter){            
            this.filter.pageIndex = 1;
        }
        this.onFilterChange.emit(this.filter);
    }

    refresh(){
        this.filterChanged(false);
    }

}

@Component({
    selector: '[sort-field]',
    template: '<div [ngClass]="{\'sorting\': filter.sortField != sortField, \'sorting_asc\': filter.sortOrder == 0 && filter.sortField == sortField, \'sorting_desc\': filter.sortOrder == 1 && filter.sortField == sortField }" (click)="sortClicked($event)"><ng-content></ng-content></div>',
    host: { 'class': 'text-center' }
})
export class DatatableSortFieldComponent {
    sortField: string;
    filter: any;

    constructor( @Inject(DatatableComponent) private parent: DatatableComponent, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.filter = this.parent.filter;
        this.sortField = this.elementRef.nativeElement.getAttribute('sort-field');
    }

    sortClicked(event) {
        if (this.filter.sortField === this.sortField) {
            this.filter.sortOrder = this.filter.sortOrder == 1 ? 0 : 1;
        } else {
            this.filter.sortField = this.sortField;
            this.filter.sortOrder = 0;
        }
        this.parent.filterChanged(true);
    }
}



// @Directive({
//     selector: '[ngModel][debounce]',
// })

// export class Debounce 
// {
//     @Output()
//     public onDebounce = new EventEmitter<any>();

//     @Input('debounce')
//     public debounceTime: number = 500;
//     private modelValue = null;
//     constructor(public model: NgControl, el: ElementRef, renderer: Renderer){}

//     ngOnInit(){
//         this.modelValue = this.model.value;

//         if (!this.modelValue){
//             var firstChangeSubs = this.model.valueChanges.subscribe(v => {
//                this.modelValue = v;
//                firstChangeSubs.unsubscribe()
//             });
//         }

//         this.model.valueChanges.pipe(debounceTime(this.debounceTime)).distinctUntilChanged().subscribe(mv =>{
//             if (this.modelValue != mv){
//                 this.modelValue = mv;
//                 this.onDebounce.emit(mv);
//             }
//         });
//     }
// }