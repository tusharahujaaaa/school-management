import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { ErpPermission } from '../constants/permission.constants';

@Directive({
  selector: '[erpHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private permissionService = inject(PermissionService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private _permissions: (ErpPermission | string)[] = [];
  private _logicalOp: 'AND' | 'OR' = 'OR';

  @Input()
  set erpHasPermission(val: ErpPermission | string | (ErpPermission | string)[]) {
    this._permissions = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  @Input()
  set erpHasPermissionOp(op: 'AND' | 'OR') {
    this._logicalOp = op;
    this.updateView();
  }

  constructor() {
    // Re-evaluate when permissions change (if they ever do dynamically)
    effect(() => {
      this.permissionService.userPermissions();
      this.updateView();
    });
  }

  private updateView(): void {
    const hasAccess = this._logicalOp === 'OR' 
      ? this.permissionService.hasAnyPermission(this._permissions)
      : this.permissionService.hasAllPermissions(this._permissions);

    if (hasAccess) {
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
}
