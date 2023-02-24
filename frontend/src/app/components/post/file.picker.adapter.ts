import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  FilePickerAdapter,
  UploadResponse,
  UploadStatus,
  FilePreviewModel
} from 'ngx-awesome-uploader';

export class Adapter extends FilePickerAdapter {
  constructor(private http: HttpClient) {
    super();
    }
  public uploadAvailable() : boolean{
    return Object.keys(this.files).length !== 0;
  }
  private files: { [fileName: string]: FilePreviewModel} = {};
  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
        this.files[fileItem.fileName] = fileItem;
        return new Observable<UploadResponse>;
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    const id = 50;
    const responseFromBackend = fileItem.uploadResponse;
    console.log(fileItem);
    const removeApi =
      'https://run.mocky.io/v3/dedf88ec-7ce8-429a-829b-bd2fc55352bc';
    return this.http.post(removeApi, { id });
    }
    
    public getFiles(): FilePreviewModel[] {
        return Object.keys(this.files).map(key => this.files[key]);
        }
}
