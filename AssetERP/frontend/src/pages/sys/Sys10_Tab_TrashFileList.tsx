/**
 * [1353] 관리자 > 02. 시스템관리 > 미사용 파일조회 (A17)
 * AS-IS: myApp/client/vi/sys/Sys10_Tab_TrashFileList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L48-79: 툴바(조회 · 일괄삭제) + 그리드(parentId·등록일·첨부파일·경로·용량·보기·받기·삭제, 체크박스 없는 단일 선택)
 * 삭제 아이콘 = 확인 → checkFileDelete(연결만 지움 1 / 사용 중 2 / 지워도 됨 3 → 파일·행 삭제). 일괄삭제는 원본 deleteAll()이 빈 메서드라 아무 일도 하지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { sysApi } from '@/api/sys';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from './Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

const NEW_ROW: Partial<FileInfo> = {};

export const Sys10_Tab_TrashFileList: React.FC = () => {
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  const crud = useGridCrud<FileInfo>({
    idField: 'fileId',
    // retrieve() L160-170: 서비스 sys.Sys10_File.findTrashFile
    search: sysApi.searchTrashFiles,
    // 저장·행 추가·삭제(행 단위)는 없다 — 원본에 저장 버튼이 없고 삭제는 아이콘 하나씩(checkFileDelete)
    save: async rows => rows,
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // checkFileDelete() L172-197: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E1] fileDeleteForm.SubmitComplete (L84) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
        return;
      }
      if (status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildFileGrid() L104-158
  const columnDefs = useMemo(() => [
    gb.long('parentId', 160, 'parentId', { editor: 'number' }),  // L148
    gb.date('regDate', 100, '등록일'),  // L149
    gb.text('fileNm', 400, '첨부파일'),  // L150
    gb.text('serverPath', 300, '경로'),  // L151
    gb.double('size', 50, '용량(KB)'),  // L152
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L153 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L154 downloadCell → FileDownload?fileType=file
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L155 deleteCell → [E4] msgBox.DialogHide [YES] (L122) → checkFileDelete()
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [crud.retrieve]);

  // [E0] 화면 열림 (생성자 L48-79) → settings(), retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] retrieveButton[조회].Select (L90) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={
        /* [E3] deleteAllButton[일괄삭제].Select (L96) → deleteAll() L199-201 — 원본 본문이 비어 있다 */
        <Button type="delete" onClick={() => undefined}>일괄삭제</Button>
      } />
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<FileInfo> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: false }} />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
