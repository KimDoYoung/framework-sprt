/**
 * 내규 서식파일 창 (H03) — Icr01_Tab_ClassTreeView 그리드의 서식파일 아이콘에서 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_IcrFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L82-152: 모달 900×400 "서식파일", 그리드(서식파일 580·등록일 100·다운로드 80·삭제 80, 체크박스 단일), 아래 가운데 [등록][닫기].
 * 이번 단계는 openPeriod()(L64-73)만 만든다: 삭제 열(5번)을 감추고 서식파일 열을 650으로, [등록]을 감춘다 → 보이는 것은 목록·다운로드·[닫기].
 * 다음 단계(내규관리 H09): 삭제 열(Sys10_File.delete)·[등록](upLoadFile L185-214)·숨은 올리기 폼 E3~E8, openUser()(다운로드 열 감춤·서식파일 720)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';

const gb = gbFor<FileInfo>();

interface Props {
  /** openPeriod(classTreeModel, callback) L64 — 서식파일을 볼 내규(`parentId = classTreeId`). 값이 있으면 열린다 */
  classTreeId: number | null;
  /** confirm() L229-232: callback.execute(); hide() — 부른 쪽이 그 내규 행을 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) */
  onClose: () => void;
}

export const Icr01_Lookup_IcrFile: React.FC<Props> = ({ classTreeId, onClosed, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);

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
    gb.text('fileNm', 650, '서식파일'),  // L177
    gb.date('regDate', 100, '등록일'),  // L178
    // L179 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<FileInfo>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L180 deleteCell(5번 열): openPeriod에서 감춘다
  ], []);

  // [E1 생략] updateButton[등록].Select (L88) → upLoadFile(): openPeriod()가 [등록]을 감춘다
  // [E3~E8 생략] 숨은 올리기·삭제 폼 (L109-119, L140, L191-248): 이 창 모드에서 도달할 수 없다
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
          <Button type="close" onClick={confirm}>닫기</Button>
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
    </LookupModal>
  );
};
