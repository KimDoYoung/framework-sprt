/**
 * 계정코드 창 (U03) — Pay50_Edit_Expense의 계정과목 칸에서 연다 (자주 쓰는 계정과목 목록, 관리자는 편집)
 * AS-IS: myApp/client/vi/pay/Pay52_Lookup_AccountCode.java (310줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(isManager, callback) L74-121: 모달 820×500 "계정코드", 툴바(계정속성 콤보 · 검색 200 "계정코드/계정과목" · 모든 계정과목 · [조회] + 관리자는 [추가][제거])
 *   + 체크박스 단일 그리드(속성 80 · 계정코드 100 · 계정과목 450 · 조회순서 100 편집, 관리자만), [저장](관리자) [확인][취소]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayFavoriteAccount } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayFavoriteAccount>();

/** 저장·삭제용 체크 — 행 클릭이 선택을 바꾸지 않게 enableClickSelection을 쓰지 않는다(03 원칙 16 예외). 상수로 넘긴다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true } as const;

/** buildGrid() L192-203: setChecked(SINGLE) — 조회순서는 관리자가 모든 계정과목을 보지 않을 때만 */
const buildGrid = (seqVisible: boolean) => [
  gb.textCenter('attributeName', 80, '속성'),
  gb.textCenter('accountCode', 100, '계정코드'),
  gb.textArea('accountName', 450, '계정과목'),
  ...(seqVisible ? [gb.longCenter('seq', 100, '조회순서', { editor: 'number' })] : []),
];

interface Props {
  open: boolean;
  /** open(isManager, …) — 관리자는 [추가][제거][저장]과 조회순서 편집이 있다 */
  isManager: boolean;
  /** callback.execute(result): [확인]·더블클릭이면 고른 계정과목 */
  onResult: (row: PayFavoriteAccount) => void;
  onClose: () => void;
}

export const Pay52_Lookup_AccountCode: React.FC<Props> = ({ open, isManager, onResult, onClose }) => {
  const [attributeCode, setAttributeCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [allAccountYn, setAllAccountYn] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  // 조회가 끝난 뒤의 모드 — 조회순서 열과 [저장] 활성이 조회한 쪽 기준이다 (AS-IS retrieve() 콜백 L218-226)
  const [loadedAll, setLoadedAll] = useState(false);
  const columnDefs = useMemo(() => buildGrid(isManager && !loadedAll), [isManager, loadedAll]);

  const crud = useGridCrud<PayFavoriteAccount>({
    idField: 'favoriteAccountId',
    // retrieve() L205-229: pay.Pay52_FavoriteAccount.selectByCompanyId(companyId, attributeCode, "%검색어%", allAccountYn)
    search: useCallback(async () => {
      const list = await payApi.searchFavoriteAccounts(attributeCode, searchText, allAccountYn);
      setLoadedAll(allAccountYn);
      return list;
    }, [attributeCode, searchText, allAccountYn]),
    // update() L274-283: pay.Pay52_FavoriteAccount.update → "저장이 완료되었습니다." → retrieve()
    save: useCallback(async (changed: PayFavoriteAccount[]) => {
      await payApi.updateFavoriteAccountSeqs(changed.map(r => ({ favoriteAccountId: r.favoriteAccountId, seq: r.seq })));
      return changed;
    }, []),
    // deleteAccountCode() L285-299: pay.Pay52_FavoriteAccount.delete
    remove: useCallback((ids: number[]) => payApi.deleteFavoriteAccounts(ids), []),
    newRow: useCallback(() => ({}), []),  // 행 추가는 계정과목 조회창으로 한다
    deleteConfirm: '선택한 계정과목을 제거하시겠습니까?',
    reloadAfterSave: true,
  });

  // [E2][E3][E4][E5] 계정속성 콤보 Collapse·검색 Enter·[조회] → retrieve()
  const retrieve = () => crud.retrieve();

  // open() L74-121 → settings(), show() — 콤보 생성 콜백(E2)이 retrieve()를 부른다.
  // 입력을 비운 다음 렌더에서 조회해야 search가 비워진 값을 읽으므로 openSeq로 한 번 건넌다
  const [openSeq, setOpenSeq] = useState(0);
  useEffect(() => {
    if (!open) return;
    setAttributeCode('%');
    setSearchText('');
    setAllAccountYn(false);
    setLoadedAll(false);
    crud.clear();
    setOpenSeq(n => n + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (openSeq > 0) void crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeq]);

  // [E1] grid.CellDoubleClick (L113) / [E9] oKButton[확인].Select (L178) → confirm() L231-242: 선택이 없으면 "선택된 계정과목이 없습니다."
  const confirm = (picked?: PayFavoriteAccount) => {
    const row = picked ?? crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 계정과목이 없습니다.');
      return;
    }
    onResult(row);
  };

  // [E6] insertButton[추가].Select (L160) → insertAccountCode() L244-272: Act01_Lookup_AccountCode.openMulti → pay.Pay52_FavoriteAccount.insert → retrieve()
  const insertAccountCode = async (accounts: { accountCodeId: number }[]) => {
    setAddOpen(false);
    try {
      await payApi.insertFavoriteAccounts(accounts.map(a => a.accountCodeId));
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '추가 실패'));
    }
  };

  // [E7] deleteButton[제거].Select (L166) → deleteAccountCode() L285-299 → [E11] YES → pay.Pay52_FavoriteAccount.delete
  const deleteAccountCode = () => void crud.deleteChecked();

  // [E8] updateButton[저장].Select (L172) → update()
  const update = () => void crud.saveRows();

  return (
    <>
      <LookupModal open={open} title="계정코드" width={920} maskClosable={false} onCancel={onClose} destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {isManager && <Button type="save" count={crud.changes} disabled={loadedAll} onClick={update}>저장</Button>}
              <Button type="save" onClick={() => confirm()}>확인</Button>
              {/* [E10] cancelButton[취소].Select (L184) → hide() */}
              <Button type="cancel" onClick={onClose}>취소</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SearchBar onSearch={retrieve} loading={crud.loading}
            extra={isManager ? (
              <Space>
                <Button type="register" onClick={() => setAddOpen(true)}>추가</Button>
                <Button type="delete" onClick={deleteAccountCode}>제거</Button>
              </Space>
            ) : undefined}>
            <SearchBar.Field label="계정속성">
              <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }} value={attributeCode}
                onChange={code => { setAttributeCode(code ?? '%'); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="계정코드/계정과목" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
            <Checkbox checked={allAccountYn} onChange={e => setAllAccountYn(e.target.checked)}>모든 계정과목</Checkbox>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<PayFavoriteAccount> crud={crud} columnDefs={columnDefs} sortable={false} rowSelection={SINGLE_CHECK}
              onRowDoubleClicked={e => { if (e.data) confirm(e.data); }} />
          </div>
        </div>
      </LookupModal>
      <Act01_Lookup_AccountCode open={addOpen} multi onMultiResult={insertAccountCode} onClose={() => setAddOpen(false)} />
    </>
  );
};
