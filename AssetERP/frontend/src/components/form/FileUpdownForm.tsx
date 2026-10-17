import { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * 숨은 파일 선택 (AS-IS myApp/client/utils/FileUpdownForm: 보이지 않는 FileUpload `fileField` + click() + ChangeHandler).
 * 부르는 쪽이 ref.current.click()으로 파일 창을 열고, 고르면 onChange(file). 같은 파일을 다시 골라도 onChange가 오도록 값을 비운다.
 * 올리기는 부르는 쪽이 fileApi.upload(parentId, file)로 한다 (AS-IS submit(actionUrl, callback)).
 *   const fileForm = useRef<FileUpdownFormHandle>(null);
 *   <FileUpdownForm ref={fileForm} onChange={file => …} />
 */
export interface FileUpdownFormHandle {
  click: () => void;
}

interface Props {
  onChange: (file: File | undefined) => void;
  /** AS-IS FileUploadMulti: 여러 파일을 한 번에 고른다. 있으면 onChange 대신 이쪽으로 고른 파일 목록을 준다 */
  onChangeFiles?: (files: File[]) => void;
  /** input accept (예: 'image/*') */
  accept?: string;
}

export const FileUpdownForm = forwardRef<FileUpdownFormHandle, Props>(({ onChange, onChangeFiles, accept }, ref) => {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({ click: () => input.current?.click() }), []);
  return (
    <input
      ref={input}
      type="file"
      name="fileField"
      accept={accept}
      multiple={!!onChangeFiles}
      style={{ display: 'none' }}
      onChange={e => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = '';
        if (onChangeFiles) onChangeFiles(files);
        else onChange(files[0]);
      }}
    />
  );
});
FileUpdownForm.displayName = 'FileUpdownForm';
