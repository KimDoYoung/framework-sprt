/**
 * 계좌 선택 조회창 (U03) — Pay50_Edit_Expense의 지급요청계좌 칸에서 연다 (다른 도메인 컴포넌트, 거래처 계좌 그리드 Sys17_Grid_CorpAccount의 열과 같다)
 * AS-IS: myApp/client/vi/sys/Sys17_Lookup_Account.java (233줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(corpId, callback) L57-78: 모달 650×400 "계좌 선택", 툴바 [조회][저장][계좌추가] + 체크박스 단일 셀 편집 그리드(기관명 150 콤보 · 계좌번호 200 · 예금주명 150 · 대표계좌 70), [선택][닫기]
 * 열자마자 조회. 저장은 대표계좌가 둘 이상이면 막고, [선택]은 저장하지 않은 변경이 있으면 막는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, CorpAccount } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CorpAccount>();

/** 저장용 체크 — 행 클릭이 선택을 바꾸지 않게 enableClickSelection을 쓰지 않는다(03 원칙 16 예외). 상수로 넘긴다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true } as const;

/** buildGrid() L120-144: setChecked(SINGLE) — bankCodeComboBox Collapse(E6)가 bankCode·bankName을 함께 바꾼다 */
const buildGrid = (banks: Code[]) => [
  gb.textCenter('bankName', 150, '기관명', {
    editor: 'select',
    values: banks.map(c => c.name),
    valueSetter: p => {
      p.data.bankName = p.newValue;
      p.data.bankCode = banks.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),  // L138
  gb.textCenter('accountName', 150, '예금주명', { editor: 'text' }),  // L139
  gb.boolean('mainAccountYn', 100, '대표계좌', { editable: true }),  // L140
];

interface Props {
  open: boolean;
  /** open(corpId, …) — null이면 빈 목록 */
  corpId: number | null;
  /** callback.execute(result): [선택]이면 고른 계좌 */
  onResult: (row: CorpAccount) => void;
  onClose: () => void;
}

export const Sys17_Lookup_Account: React.FC<Props> = ({ open, corpId, onResult, onClose }) => {
  const [banks, setBanks] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(banks), [banks]);

  useEffect(() => { sysApi.searchCodes('BankCode').then(setBanks).catch(() => setBanks([])); }, []);

  const crud = useGridCrud<CorpAccount>({
    idField: 'corpAccountId',
    // retrieve() L146-161: corpId가 null이면 store를 비운다 → sys.Sys17_CorpAccount.selectByCorpId
    search: useCallback(() => (corpId ? sysApi.searchCorpAccounts(corpId) : Promise.resolve([])), [corpId]),
    save: useCallback((rows: CorpAccount[]) => sysApi.updateCorpAccounts(corpId!, rows), [corpId]),
    remove: useCallback(async () => 0, []),  // 이 창에는 삭제가 없다
    // insert() L204-210: insertModel.setCorpId(corpId). mainAccountYn은 Boolean 기본값 false
    newRow: useCallback(() => ({ corpId: corpId ?? undefined, mainAccountYn: 'false' }), [corpId]),
    firstEditField: 'bankName',
  });

  // [E0] open() L57-78 → settings(), show(), retrieve()
  useEffect(() => {
    if (open) void crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, corpId]);

  // [E2] updateButton[저장].Select (L94) → update() L163-202: 대표계좌가 둘 이상이면 "대표계좌는 1개만 지정가능합니다"
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    if (crud.rows.filter(r => r.mainAccountYn === 'true').length > 1) {
      message.warning('대표계좌는 1개만 지정가능합니다');
      return;
    }
    await crud.saveRows();
  };

  // [E4] selectButton[선택].Select (L106) → select() L212-227
  const select = () => {
    crud.gridRef.current?.api?.stopEditing();
    if (crud.hasChanges()) {
      message.warning('저장 후 선택 가능합니다.');
      return;
    }
    const picked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (picked.length === 0) {
      message.warning('계좌를 선택해주세요');
      return;
    }
    onResult(picked[0]);
  };

  return (
    <LookupModal open={open} title="계좌 선택" width={650} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={select}>선택</Button>
            {/* [E5] closeButton[닫기].Select (L112) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L88) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          <Button type="save" count={crud.changes} onClick={update}>저장</Button>
          {/* [E3] insertButton[계좌추가].Select (L100) → insert() L204-210 */}
          <Button type="register" onClick={() => crud.addRow()}>계좌추가</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<CorpAccount> crud={crud} columnDefs={columnDefs} sortable={false} rowSelection={SINGLE_CHECK} />
        </div>
      </div>
    </LookupModal>
  );
};
