/**
 * 항목별 계정연결 (U17) — 법인카드 현황(#1333)의 [항목별 계정연결]이 연다
 * AS-IS: myApp/client/vi/biz/Biz03_Lookup_AccountMap.java (269줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 창 780x500(크기 고정), 제목 "항목별 계정연결". 생성자 L67-150: 위 = 툴바 [등록][저장][삭제](오른쪽 정렬), 가운데 = 왼쪽 290 항목 그리드(항목명 150 · 순서 80) | 오른쪽 계정 그리드(체크박스 다중, 계정코드 150(조회창 칸) · 계정과목명 250),
 *   아래 = 안내 글 세 줄. 창 아래 버튼(가운데): [닫기] — 닫으면 부른 쪽이 다시 조회한다(callback)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { bizAccountMapApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizAccountMap, BizCardUseItem } from '@/types/biz';
import { AccountCode } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const codeGb = gbFor<BizCardUseItem>();
const gb = gbFor<BizAccountMap>();

/** buildcodeGrid() L152-157 */
const codeColumns = [
  codeGb.text('name', 150, '항목명'),  // L154
  codeGb.text('seq', 80, '순서'),  // L155
];

interface Props {
  open: boolean;
  /** closeButton[닫기].Select (L103) → hide(), callback.execute() */
  onClose: () => void;
}

export const Biz03_Lookup_AccountMap: React.FC<Props> = ({ open, onClose }) => {
  const [items, setItems] = useState<BizCardUseItem[]>([]);
  const codeGridRef = useRef<AgGridReact<BizCardUseItem>>(null);
  const selected = useRef<BizCardUseItem | undefined>(undefined);
  /** 계정코드 칸으로 조회창을 연 행. 'new'는 방금 [등록]한 빈 행 */
  const [target, setTarget] = useState<{ accountMapId: number | 'new' } | null>(null);

  const crud = useGridCrud<BizAccountMap>({
    idField: 'accountMapId',
    // retrieveMap() L203-213: 서비스 biz.Biz03_AccountMap.selectByUseItemCode(companyId, useItemCode = 고른 항목 코드)
    search: useCallback(() => (selected.current ? bizAccountMapApi.searchByUseItemCode(selected.current.code) : Promise.resolve([])), []),
    // update() L241-253: GridUpdate → biz.Biz03_AccountMap.update (UpdateDataModel — 필수값 검사 없음)
    save: bizAccountMapApi.save,
    reloadAfterSave: true,
    // delete() L255-259: GridDeleteData → biz.Biz03_AccountMap.delete (체크한 행)
    remove: bizAccountMapApi.remove,
    // insert() L215-239: GridInsertRow, companyId ← 로그인 회사(서버), useItemCode ← 고른 항목 코드
    newRow: useCallback(() => ({ useItemCode: selected.current?.code ?? '', accountCodeId: null, accountCode: null, accountName: null }), []),
  });

  // [E0] 화면 열림 (생성자 L67-150, open() L62-65) → retrieve() L187-201: 서비스 sys.Sys09_Code.selectByCodeKind(BizCardUseItemCode, 오늘) → 첫 행을 고른다
  useEffect(() => {
    if (!open) return;
    selected.current = undefined;
    setItems([]);
    crud.clear();
    bizAccountMapApi.searchUseItems()
      .then(list => {
        setItems(list);
        if (list.length > 0) setTimeout(() => codeGridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] codeGrid.SelectionChanged [선택>0] (L74) → retrieveMap(codeModel) L203-213
  const onCodeSelect = (row: BizCardUseItem | undefined) => {
    if (!row) return;
    selected.current = row;
    void crud.retrieve();
  };

  /** 조회창에서 고른 계정을 그 행에 반영한다 (addChange accountCodeId·accountCode·accountName) */
  const applyAccount = (acc: AccountCode) => {
    const t = target;
    setTarget(null);
    if (!t) return;
    const row = t.accountMapId === 'new'
      ? [...crud.rows].reverse().find(r => r.accountMapId <= 0 && r.accountCodeId == null)
      : crud.rows.find(r => r.accountMapId === t.accountMapId);
    if (row) crud.updateRow(row.accountMapId, { accountCodeId: acc.accountCodeId, accountCode: acc.accountCode, accountName: acc.accountName });
  };

  // buildAccountMapGrid() L159-185 — lookupAccountCode: LookupTriggerField(setEditable(false)) [E6] TriggerClick (L164) → Act01_Lookup_AccountCode.open
  const columnDefs = useMemo(() => [
    gb.text('accountCode', 150, '계정코드', {  // L182
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: BizAccountMap; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setTarget({ accountMapId: p.data.accountMapId }); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('accountName', 250, '계정과목명'),  // L183
  ], []);

  // [E2] insertButton[등록].Select (L84) → insert() L215-239: 맨 아래에 빈 행을 만들고 곧바로 Act01_Lookup_AccountCode.open
  const insert = () => {
    if (!selected.current) return;
    crud.addRow();
    setTarget({ accountMapId: 'new' });
  };

  return (
    <LookupModal
      open={open}
      title={<b style={{ color: '#0069B4' }}>항목별 계정연결</b>}
      width={780}
      centered
      maskClosable={false}
      onCancel={onClose}
      footer={
        <Space>
          {/* [E5] closeButton[닫기].Select (L103) → hide(), callback.execute() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <Button type="register" onClick={insert}>등록</Button>
          {/* [E3] updateButton[저장].Select (L90) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L96) → delete() */}
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', border: '1px solid #d9d9d9' }}>
          <div style={{ width: 290, minHeight: 0 }}>
            <SingleGrid<BizCardUseItem>
              gridRef={codeGridRef}
              rowData={items}
              columnDefs={codeColumns}
              getRowId={p => p.data.code}
              onSelect={onCodeSelect}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CellEditGrid<BizAccountMap> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
        {/* buttonBarBottom L124-127 */}
        <div style={{ border: '1px solid #d9d9d9', padding: '6px 8px', fontSize: 12, lineHeight: '18px', color: '#555' }}>
          *항목명은 [관리자 &gt; 09.기타 &gt; 공통코드] 화면에서 추가하세요.(검색어:법인카드사용항목)<br />
          &nbsp;법인카드사용항목은 최대 11개까지 추가 가능합니다. 11개 이상으로 추가했을 시 표가 깨질 수 있으니 주의 바랍니다.<br />
          &nbsp;등록되지 않은 계정과목은 기타 항목으로 자동으로 빠지게 됩니다.(기타 항목은 기본항목으로 추가 X)
        </div>
      </div>
      <Act01_Lookup_AccountCode open={target != null} onResult={applyAccount} onClose={() => setTarget(null)} />
    </LookupModal>
  );
};
