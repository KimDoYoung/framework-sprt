/**
 * 펀드별 보수입금계좌 이력 그리드 (X27) — Icam11_Tab_OfficeMngFeeDeposit의 오른쪽(Center) 그리드
 * AS-IS: myApp/client/vi/icam/Icam11_Grid_MngFeeDeposit.java (192줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * buildGrid() L54-104: 단일 체크 셀 편집 그리드 — 적용시작일 100(날짜 편집) · 예금계좌 150(조회창 트리거, 글자 입력 불가)
 * retrieve(model, searchText) L106-126 / insertRow() L159-167 / update() L137-156 / deleteRow() L170-191 — 위 탭의 [등록][저장][삭제]가 부른다
 * UX보강(10): [저장(n)] UX-03(위 탭의 버튼에 변경 수를 알린다), 편집 가능한 날짜 열 폭 120(UX-08)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { icamApi } from '@/api/icam';
import { IcamFeeDeposit } from '@/types/icam';
import type { ChangeCount } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ast01_Lookup_CorpAccount } from '@/pages/ast/Ast01_Lookup_CorpAccount';

const gb = gbFor<IcamFeeDeposit>();

export interface MngFeeDepositGridHandle {
  insertRow: () => void;
  update: () => void;
  deleteRow: () => void;
}

interface Props {
  /** retrieve(depositModel, …)의 위 그리드 선택 행 (운용사코드·펀드코드) */
  master: IcamFeeDeposit | null;
  /** 변경된 행 수 — 위 탭의 [저장(n)] */
  onChanges?: (count: ChangeCount) => void;
}

export const Icam11_Grid_MngFeeDeposit = forwardRef<MngFeeDepositGridHandle, Props>(({ master, onChanges }, ref) => {
  // [E0] 화면 열림 (생성자 L43-52) → 초기화: 위 탭이 선택 행(master)을 넘겨 줄 때까지 비어 있다
  const masterRef = useRef(master);
  masterRef.current = master;
  const [lookupRow, setLookupRow] = useState<IcamFeeDeposit | null>(null);

  const crud = useGridCrud<IcamFeeDeposit>({
    idField: 'feeDepositId',
    // retrieve() L106-126: icam.Icam11_FeeDeposit.selectByFundCode2(companyId, icamCompanyCode, fundCode, searchText)
    search: useCallback(() => {
      const m = masterRef.current;
      return m?.fundCode ? icamApi.searchFeeDepositsByFund(m.icamCompanyCode, m.fundCode) : Promise.resolve([]);
    }, []),
    // update() L137-156: icam.Icam11_FeeDeposit.update
    save: icamApi.saveFeeDeposits,
    // deleteRow() L170-191: "선택한 정보를 삭제하시겠습니까?" → [E2] YES → icam.Icam11_FeeDeposit.delete
    remove: icamApi.deleteFeeDeposits,
    deleteConfirm: () => '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L159-167: 회사 = 로그인 회사(서버가 채움), 펀드코드·운용사코드 = 위 그리드 선택 행
    newRow: useCallback((): Partial<IcamFeeDeposit> => ({ fundCode: masterRef.current?.fundCode ?? null, icamCompanyCode: masterRef.current?.icamCompanyCode ?? null }), []),
    firstEditField: 'startDate',
    // update() L137-156: 적용시작일·예금계좌가 없으면 안내하고 저장하지 않는다
    validate: changed => {
      for (const r of changed) {
        if (!r.startDate) return '적용시작일을 입력해주세요.';
        if (r.depositId == null) return '예금계좌를 선택해주세요.';
      }
      return undefined;
    },
  });
  const { retrieve } = crud;

  // [E1 위 탭] grid.RowClick (L71) → retrievePage() → depositGrid.retrieve(선택 행, 검색어): 선택 펀드가 바뀌면 이력을 다시 읽는다
  const fundKey = master ? `${master.icamCompanyCode}|${master.fundCode}` : '';
  useEffect(() => { void retrieve(); }, [fundKey]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { onChanges?.(crud.changes); }, [crud.changes]);  // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    insertRow: () => {
      if (!masterRef.current?.fundCode) { message.warning('펀드를 선택해주세요.'); return; }
      crud.addRow();
    },
    update: () => { void crud.saveRows(); },
    deleteRow: () => { void crud.deleteChecked(); },
  }));

  // buildGrid() L54-104: 예금계좌 열은 LookupTriggerField(글자 입력 불가) — 돋보기를 누르면 Ast01_Lookup_CorpAccount(오늘, "NOT")
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일', { editor: 'date' }),                                       // L100
    gb.text('depositName', 150, '예금계좌', {                                                          // L101
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: IcamFeeDeposit; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setLookupRow(p.data); }} />
          {p.value}
        </>
      ),
    }),
  ], []);

  return (
    <>
      <CellEditGrid<IcamFeeDeposit> crud={crud} columnDefs={columnDefs} />
      {/* [E1] depositName.TriggerClick [result != null] (L76) → Ast01_Lookup_CorpAccount.open(오늘, "NOT"): 고르면 ID·이름, 선택안함이면 둘 다 비운다 */}
      <Ast01_Lookup_CorpAccount
        open={lookupRow != null}
        stdDate={dayjs()}
        mode="NOT"
        onResult={acct => {
          if (lookupRow) crud.updateRow(lookupRow.feeDepositId, { depositId: acct?.classTreeId ?? null, depositName: acct?.classTreeName ?? null });
          setLookupRow(null);
        }}
        onClose={() => setLookupRow(null)}
      />
    </>
  );
});
