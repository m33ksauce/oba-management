import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Directive({
  selector: '[appDnd]',
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver = false;
  @Output() fileDropped = new EventEmitter();

  constructor(private fileService: FileService) {}

  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) async onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files = await this.fileService.getDroppedOrSelectedFiles(evt);
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
