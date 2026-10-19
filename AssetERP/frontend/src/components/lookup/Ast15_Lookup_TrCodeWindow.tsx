/**
 * 화면별 거래유형 등록 조회창 (E29) — Ast05_Tab_TrCodeAdmin의 [화면별 거래유형 등록]에서 연다
 * AS-IS: myApp/client/vi/ast/Ast15_Lookup_TrCodeWindow.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-114: 모달 1500×750 "화면별 거래유형 등록", 왼쪽 680 = 툴바(회사 0이면 운용사 칸 150 · [조회][등록][삭제]) + 화면 그리드(행번호, 메뉴명 370 · Class명 250, 단일 선택),
 * 가운데 = Ast15_Page_TrCodeWindow. 회사 0이 아니면 로그인 회사로 열자마자 조회
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { TrCodeWindow } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Ast15_Page_TrCodeWindow, TrCodeWindowTarget } from '@/components/lookup/Ast15_Page_TrCodeWindow';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Sys06_Lookup_SearchMenu } from '@/components/lookup/Sys06_Lookup_SearchMenu';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<TrCodeWindow>();

/** buildGrid() L165-173 */
const columnDefs = [
  gb.text('menuFullName', 370, '메뉴명'),  // L169
  gb.text('windowClassName', 250, 'Class명'),  // L170
];

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Ast15_Lookup_TrCodeWindow: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<TrCodeWindow>>(null);
  // 회사 0만 운용사 칸이 있다(L72-78). 그 밖에는 로그인 회사
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [rows, setRows] = useState<TrCodeWindow[]>([]);
  const [pageTarget, setPageTarget] = useState<TrCodeWindowTarget>({ className: null, companyId: null, nonce: 0 });

  // retrievePage() L175-180: 고른 화면의 Class명으로 오른쪽 페이지를 다시 읽는다
  const retrievePage = (row: TrCodeWindow | undefined, company: number | null) => {
    if (row) setPageTarget(t => ({ className: row.windowClassName ?? null, companyId: company, nonce: t.nonce + 1 }));
  };

  // retrieve() L182-198: 운용사를 안 골랐으면 "운용사를 선택해주세요.", 읽은 뒤 첫 행을 고르고 retrievePage()
  const retrieve = async (company: number | null = companyId) => {
    if (company == null) {
      message.warning('운용사를 선택해주세요.');
      return;
    }
    try {
      const list = await astApi.searchTrCodeWindows(company);
      setRows(list);
      if (list.length > 0) {
        retrievePage(list[0], company);
        requestAnimationFrame(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true));
      } else {
        setPageTarget(t => ({ className: null, companyId: company, nonce: t.nonce + 1 }));
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L65-114) → settings(), show(), retrieve() (회사 0이 아닐 때만 — 운용사가 정해져 있다)
  useEffect(() => {
    if (!open) return;
    setRows([]);
    setPageTarget({ className: null, companyId: null, nonce: 0 });
    if (user.companyId === 0) {
      setCompanyId(null);
      setCompanyName('');
    } else {
      setCompanyId(user.companyId);
      void retrieve(user.companyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E4] insertButton[등록].Select (L151) → insertRow() L200-231: 화면 찾기에서 고른 메뉴를 거래코드 없는 행으로 등록 → retrieve()
  const insertRow = () => {
    if (companyId == null) {
      message.warning('운용사를 선택해주세요.');
      return;
    }
    setSearchMenuOpen(true);
  };

  // [E5] deleteButton[삭제].Select (L157) → deleteRow() L233-252: "확인"/"해당 화면별 거래유형의 메뉴를 삭제하시겠습니까?" → [E6] msgBox.DialogHide [YES] (L236) → delete() L254-258
  const deleteRow = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 화면별 거래유형의 메뉴를 삭제하시겠습니까?',
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        const checked = gridRef.current?.api.getSelectedRows() ?? [];
        if (checked.length === 0) return;
        try {
          await astApi.deleteTrCodeWindows(checked.map(r => r.trCodeWindowId), companyId);
          const gone = new Set(checked.map(r => r.trCodeWindowId));
          setRows(list => list.filter(r => !gone.has(r.trCodeWindowId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal open={open} title="화면별 거래유형 등록" width={1500} maskClosable={false} onCancel={onClose} destroyOnHidden footer={null}>
      <div style={{ height: 650, display: 'flex', gap: 8 }}>
        <div style={{ width: 680, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* 생성자 L72-78: 회사 0만 운용사 칸. [E1] companyField.TriggerClick [result != null] (L122) → settings() L118-135: Sys01_Lookup_Company, 고르면 칸과 companyId */}
            {user.companyId === 0 && (
              <LookupInput width={150} placeholder="운용사 선택" value={companyName} onOpen={() => setCompanyOpen(true)}
                onClear={() => { setCompanyName(''); setCompanyId(null); }} />
            )}
            {/* [E3] retrieveButton[조회].Select (L145) → retrieve() */}
            <Button type="search" onClick={() => retrieve()}>조회</Button>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.CellClick (L139) → retrievePage() */}
            <SingleGrid<TrCodeWindow>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.trCodeWindowId)}
              rowSelection={SINGLE_ROW}
              onRowClicked={e => retrievePage(e.data, companyId)}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', padding: 4 }}>
          <Ast15_Page_TrCodeWindow target={pageTarget} />
        </div>
      </div>
      <Sys01_Lookup_Company
        open={companyOpen}
        onResult={c => {
          if (c) {
            setCompanyName(c.companyNm);
            setCompanyId(c.companyId);
          }
          setCompanyOpen(false);
        }}
        onClose={() => setCompanyOpen(false)}
      />
      <Sys06_Lookup_SearchMenu
        open={searchMenuOpen}
        companyId={companyId}
        onResult={async menu => {
          setSearchMenuOpen(false);
          try {
            await astApi.addTrCodeWindow(menu.className ?? '', companyId);
            await retrieve();
          } catch (err) {
            message.error(errorMessage(err, '등록 실패'));
          }
        }}
        onClose={() => setSearchMenuOpen(false)}
      />
    </LookupModal>
  );
};
