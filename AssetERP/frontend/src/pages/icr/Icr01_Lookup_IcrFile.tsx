/**
 * 내규 서식파일 창 (H03, H09) — 내규조회(H03 Icr01_Tab_ClassTreeView)의 서식파일 아이콘은 openPeriod(), 내규관리(H09 Icr01_Grid_IcrType)의 서식파일 아이콘은 open()으로 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_IcrFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L82-152: 모달 900×400 "서식파일", 그리드(서식파일 580·등록일 100·다운로드 80·삭제 80, 체크박스 단일), 아래 가운데 [등록][닫기].
 * openPeriod()(L64-73, 기본): 삭제 열(5번)을 감추고 서식파일 열을 650으로, [등록]을 감춘다 → 보이는 것은 목록·다운로드·[닫기].
 * open()(L75-80, `admin`): 전부 보인다 — [등록]은 upLoadFile()(L185-214)로 파일을 골라 올리고(FileUpload?parentId=&fileYn=true&adminYn=true) 다시 조회,
 *   삭제 열은 sys.Sys10_File.delete(UpdateDataModel.deleteModel)로 sys10_file 행만 지운다. openUser()(다운로드 열 숨김)는 부르는 화면이 없어 만들지 않았다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi } from '@/api/file';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';

const gb = gbFor<FileInfo>();

interface Props {
  /** openPeriod(classTreeModel, callback) L64 / open(classTreeModel, callback) L75 — 서식파일을 볼 내규(`parentId = classTreeId`). 값이 있으면 열린다 */
  classTreeId: number | null;
  /** open(): [등록]·삭제 열이 보이는 관리 모드 (내규관리). 없으면 openPeriod() */
  admin?: boolean;
  /** confirm() L229-232: callback.execute(); hide() — 부른 쪽이 그 내규 행을 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) */
  onClose: () => void;
}

export const Icr01_Lookup_IcrFile: React.FC<Props> = ({ classTreeId, admin, onClosed, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const uploadRef = useRef<FileUpdownFormHandle>(null);

  // retrieve() L216-227: 서비스 sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (classTreeId == null) return;
    try {
      setRows(await fileApi.searchByParentId(classTreeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId]);

  // [E0] 화면 열림 → settings() L82-152: ... retrieve()
  useEffect(() => { setRows([]); void retrieve(); }, [retrieve]);

  // buildApprFileGrid() L154-183 (openPeriod: setHidden(5), setColumnWidth(2, 650))
  const columnDefs = useMemo(() => [
    gb.text('fileNm', admin ? 580 : 650, '서식파일'),  // L177
    gb.date('regDate', 100, '등록일'),  // L178
    // L179 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<FileInfo>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L180 deleteCell(5번 열): GridDeleteData sys.Sys10_File.delete(고른 행) — 확인 창 없이 지운다. openPeriod에서는 감춘다
    ...(admin ? [iconCell<FileInfo>('delete', 'actionCellDelete', 80, '삭제', async row => {
      if (classTreeId == null) return;
      try {
        await icrApi.deleteRuleFile(classTreeId, row.fileId);
        setRows(prev => prev.filter(r => r.fileId !== row.fileId));
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    })] : []),
  ], [admin, classTreeId]);

  // [E1] updateButton[등록].Select (L88) → upLoadFile() L185-214: 파일 선택 창을 연다
  // [E3] fileUpload.Change (L109) → FileUpload?parentId&fileYn=true&adminYn=true [E4] fileUploadForm.SubmitComplete (L119) → resetFileUpload(), retrieve()
  // [E6] fileUpload.Change (L191)·[E7] fileUploadForm.SubmitComplete (L201)·[E8] fileUpload.Change (L241): upLoadFile()·resetFileUpload()가 같은 핸들러를 다시 거는 것 — 같은 업로드
  const uploadFile = async (file: File | undefined) => {
    if (classTreeId == null || !file) return;
    try {
      await fileApi.upload(classTreeId, file, { fileYn: true });
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieve();
  };

  // [E5] fileDeleteForm.SubmitComplete (L140) → retrieve(): fileDeleteForm은 어디서도 submit하지 않는다(삭제는 삭제 아이콘이 GridDeleteData로 한다) → 생략

  // [E2] closeButton[닫기].Select (L94) → confirm() L229-232: callback.execute(); hide()
  const confirm = () => { onClosed(); onClose(); };

  return (
    <LookupModal
      open={classTreeId != null}
      title="서식파일"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {admin && <Button type="register" onClick={() => uploadRef.current?.click()}>등록</Button>}
            <Button type="close" onClick={confirm}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 260 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      {admin && <FileUpdownForm ref={uploadRef} onChange={uploadFile} />}
    </LookupModal>
  );
};
