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
  /** input accept (예: 'image/*') */
  accept?: string;
}

export const FileUpdownForm = forwardRef<FileUpdownFormHandle, Props>(({ onChange, accept }, ref) => {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({ click: () => input.current?.click() }), []);
  return (
    <input
      ref={input}
      type="file"
      name="fileField"
      accept={accept}
      style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files?.[0];
        e.target.value = '';
        onChange(file);
      }}
    />
  );
});
FileUpdownForm.displayName = 'FileUpdownForm';
