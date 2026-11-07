/**
 * 공용메일 List 조회창 (EE35) — Dcr10_Lookup_MailSender의 [공용메일]이 연다
 * AS-IS: myApp/client/vi/cmp/Cmp10_Lookup_MailBookList.java (164줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L45-72: 모달 "공용메일 List" 650×450, 위 [검색][조회], 단일 체크 그리드(이메일 220 · 비고 340), 아래 가운데 [확인][취소]. 열면서 바로 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 행 클릭 선택(UX-06)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dcrMailSenderApi } from '@/api/dcrMail';
import { errorMessage } from '@/api/client';
import { DcrPublicMail } from '@/types/dcrMail';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<DcrPublicMail>();

/** buildGrid() L110-118 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('emailAddr', 220, '이메일'),
  gb.text('note', 340, '비고'),
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(mailModel): [확인]·더블클릭의 고른 공용메일 (부르는 쪽이 닫는다) */
  onResult: (mail: DcrPublicMail) => void;
  onClose: () => void;
}

export const Cmp10_Lookup_MailBookList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<DcrPublicMail>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrPublicMail[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L120-131 → cmp.Cmp10_MailBook.selectByText ("%검색어%"는 서버가 감싼다)
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await dcrMailSenderApi.searchPublicMails(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L45-72: 열면서 retrieve() (E0 없음)
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // confirm() L133-144: 고른 행이 없으면 "공용메일을 선택해주세요", 있으면 callback 뒤 닫기
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('공용메일을 선택해주세요');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal
      open={open}
      title="공용메일 List"
      width={750}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] confirmButton[확인].Select (L90) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L96) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searhTextField.KeyPress Enter (L76) → retrieve(). [E2] retrieveButton[조회].Select (L84) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E5] grid.CellDoubleClick (L102) → confirm() */}
          <SingleGrid<DcrPublicMail>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.mailBookId)}
            onRowDoubleClicked={e => { if (e.data) onResult(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
