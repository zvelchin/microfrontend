import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';
import { TestRoutingModule } from './test.routes';

@NgModule({
  imports: [CommonModule, TestRoutingModule],
  declarations: [TestComponent],
})
export class TestModule {}
