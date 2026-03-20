export class UploadFile {
  
    onUpload(selectedFiles: FileList) {
        const imagesFormData = new FormData();

        for (let i = 0; i < selectedFiles.length; i++) {
            imagesFormData.append('images', selectedFiles[i]);
        }

        return imagesFormData;
    }


}