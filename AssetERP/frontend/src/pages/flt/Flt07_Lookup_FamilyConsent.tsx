/**
 * 가족 금융거래정보 이용동의서 조회창 (J07) — Flt02_Tab_EmpInfo의 가족동의서 칸을 눌러 연다.
 * AS-IS: myApp/client/vi/flt/Flt07_Lookup_FamilyConsent.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-68: 모달 600×300 "가족 금융거래정보 이용동의서", 그리드(체크 단일 선택: 첨부파일 400 · 보기 50 · 받기 50) + [닫기]. open(personId) L70-73: retrieve()
 * 서비스 sys.Sys10_File.selectByFamilyConsentId(personId). 보기 = Sys10_Lookup_FileViewer(파일보기), 받기 = FileDownload
 * UX보강(10): 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

/** setChecked(SelectionMode.SINGLE) — 체크 단일 선택 (11 §4: 상수로 빼서 넘긴다) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** AS-IS open(personId)의 사원 ID — 값이 있으면 열린다 */
  personId: number | null;
  onClose: () => void;
}

export const Flt07_Lookup_FamilyConsent: React.FC<Props> = ({ personId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // buildGrid() L75-105 — 보기: Sys10_Lookup_FileViewer.open(fileId) / 받기: FileDownload?fileType=file&fileId=
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 400, '첨부파일'),
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', row => setViewFile(row)),
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  // retrieve() L107-118: 서비스 sys.Sys10_File.selectByFamilyConsentId(personId)
  const retrieve = useCallback(async () => {
    if (personId == null) return;
    try {
      setRows(await fltApi.searchFamilyConsentFiles(personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId]);

  // [E0] 화면 열림 (생성자 L42-68) → show() — open(): retrieve()
  useEffect(() => {
    setRows([]);
    void retrieve();
  }, [retrieve]);

  return (
    <>
      <LookupModal
        open={personId != null}
        title="가족 금융거래정보 이용동의서"
        width={690}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] cancelButton[닫기].Select (L52) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 160 }}>
          <SingleGrid<FileInfo> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} rowSelection={ROW_SELECTION} />
        </div>
      </LookupModal>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
