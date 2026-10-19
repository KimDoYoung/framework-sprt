/**
 * 거래유형 조회창 (E30) — Act11_Tab_TrJournalMap의 거래코드 칸에서 연다 (act 등 다른 도메인에서도 쓰는 조회창)
 * AS-IS: myApp/client/vi/ast/Ast05_Lookup_TrCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(actionCode, assetType, financeYn, searchText, callback) L72-99: 모달 600×400(antd 안쪽 여백 때문에 폭 620) "거래유형", 툴바(거래코드/명 200 · 수령/지급 100(edit에서는 숨김) · 조회 + edit만 [행 추가][행 삭제])
 *   + 그리드(행번호, 단일 선택) + 아래 [저장](edit만) [확인] [전체](view만) [닫기]
 * - view: 거래코드 80 · 거래명 240 · 수령/지급 120 읽기 전용 + 사용여부 100, edit: 같은 열을 셀 편집(거래코드·거래명 글자, 수령/지급 콤보)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03, 지운 행도 건수에 센다). 초기화(UX-02)는 모달 폭 600에서 줄바꿈이 생겨 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { TrCode } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<TrCode>();
const ALL = '%';

/** buildGrid() L256-278: 같은 열을 읽기 전용(view)과 셀 편집(edit)으로 둘 다 만들고 setting() L133-254가 한쪽을 숨긴다 */
const buildGrid = (edit: boolean, rcvPay: Code[]) => edit
  ? [
    gb.text('trCode', 80, '거래코드', { editor: 'text' }),  // L271
    gb.text('trName', 240, '거래명', { editor: 'text' }),  // L272
    gb.text('rcvPayName', 120, '수령/지급', {  // L273 — [E10] RcvPayComboBox[RcvPayCode].Collapse (L261): 고른 코드·이름을 그 행에 반영
      editor: 'select',
      values: rcvPay.map(c => c.name),
      valueSetter: p => {
        p.data.rcvPayName = p.newValue;
        p.data.rcvPayCode = rcvPay.find(c => c.name === p.newValue)?.code ?? p.data.rcvPayCode;
        return true;
      },
    }),
    gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L274
  ]
  : [
    gb.text('trCode', 80, '거래코드'),  // L268
    gb.text('trName', 240, '거래명'),  // L269
    gb.text('rcvPayName', 120, '수령/지급'),  // L270
    gb.boolean('useYn', 100, '사용여부'),  // L274
  ];

/** update() L292-309: 바뀐 행마다 거래코드 → 거래명 → 수령/지급 순으로 필수 검사 */
const validateTrCodes = (changed: TrCode[]) => {
  for (const r of changed) {
    if (r.trCode == null || r.trCode === '') return '거래코드는 필수입력 항목입니다.';
    if (r.trName == null || r.trName === '') return '거래명은 필수입력 항목입니다.';
    if (r.rcvPayName == null || r.rcvPayName === '') return '수령/지급은 필수입력 항목입니다.';
  }
  return undefined;
};

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정). setChecked 없음 → 행을 눌러 하나를 고른다 */
const SINGLE_CLICK = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** actionCode: "view"(고르기) / "edit"(고르기 + 거래코드 편집) */
  mode: 'view' | 'edit';
  /** 자산구분 ("1") */
  assetType: string;
  /** 금융상품거래만/아닌 것만 (없으면 전체) */
  financeYn?: boolean | null;
  /** open(…, searchText, …): 검색칸에 미리 넣을 글자 */
  searchText?: string;
  /** callback.execute(result): 확인이면 고른 거래코드, [전체]면 null */
  onResult: (row: TrCode | null) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Ast05_Lookup_TrCode: React.FC<Props> = ({ open, mode, assetType, financeYn, searchText, onResult, onClose }) => {
  const user = useLoginUser();
  const edit = mode === 'edit';
  const [text, setText] = useState('');
  const [rcvPayCode, setRcvPayCode] = useState(ALL);
  const [rcvPay, setRcvPay] = useState<Code[]>([]);
  // deleteList: 행 삭제로 뺀 행 — 저장 때 지운다 (deleteRow() L377-383, update() L280-327)
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const q = useRef({ text: '', rcvPayCode: ALL });
  q.current = { text, rcvPayCode };

  const columnDefs = useMemo(() => buildGrid(edit, rcvPay), [edit, rcvPay]);

  const crud = useGridCrud<TrCode>({
    idField: 'trCodeId',
    // retrieve() L329-363: 로그인 회사, 사용 중인 코드만, "%검색어%", 수령/지급(전체면 "%"), 자산구분, 금융상품거래 → ast.Ast05_TrCode.selectBySearchText
    search: useCallback(() => astApi.lookupTrCodes(q.current.text, q.current.rcvPayCode, assetType, financeYn), [assetType, financeYn]),
    // update() L280-327: GridUpdate → ast.Ast05_TrCode.update 뒤 다시 조회
    save: useCallback((rows: TrCode[]) => astApi.updateTrCodes(rows), []),
    remove: useCallback((ids: number[]) => astApi.deleteTrCodes(ids), []),
    // insertRow() L365-375: 회사 = 로그인 회사, 자산구분, 금융상품거래 끔, 사용 켬, 잠금 끔
    newRow: useCallback(() => ({ companyId: user.companyId, financeYn: 'false', useYn: 'true', lockYn: 'false' }), [user.companyId]),
    firstEditField: 'trCode',
    reloadAfterSave: true,
    validate: validateTrCodes,
  });

  // [E0] 화면 열림 (생성자 L112-131) → show(), open() L86-99: 새 창이라 입력을 처음 값(검색어는 넘겨받은 글자)으로 하고 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    const init = searchText ?? '';
    setText(init);
    setRcvPayCode(ALL);
    setDeleteList([]);
    q.current = { text: init, rcvPayCode: ALL };
    if (edit) sysApi.searchCodes('RcvPayCode').then(setRcvPay).catch(() => undefined);
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const retrieve = async () => {
    await crud.retrieve();
    setDeleteList([]);
  };

  // [E1] grid.CellDoubleClick (L134) / [E2] confirmButton[확인].Select (L150): edit에서 바뀐 것이 있으면 "저장 후 선택해주세요.", 선택이 없으면 "선택된 거래유형이 없습니다."
  const confirm = () => {
    if (edit && crud.hasChanges()) {
      message.warning('저장 후 선택해주세요.');
      return;
    }
    const row = crud.gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 거래유형이 없습니다.');
      return;
    }
    onResult(row);
  };

  // [E8] deleteButton[행 삭제].Select (L201) → deleteRow() L377-383: 고른 행을 그리드에서 빼고 deleteList에 모은다
  const deleteRow = () => {
    const rows = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (rows.length === 0) return;
    setDeleteList(prev => [...prev, ...rows.map(r => r.trCodeId).filter(id => id > 0)]);
    crud.removeRows(rows.map(r => r.trCodeId));
  };

  // [E6] updateButton[저장].Select (L189) → update() L280-327: 변동이 없으면 "변동내역이 없습니다.", 모은 삭제를 먼저 지우고 저장 → 다시 조회
  const update = async () => {
    const changed = crud.getChanged();
    if (changed.length === 0 && deleteList.length === 0) {
      message.info('변동내역이 없습니다.');
      return;
    }
    if (changed.length > 0) {
      const msg = validateTrCodes(changed);
      if (msg) {
        message.warning(msg);
        return;
      }
    }
    try {
      if (deleteList.length > 0) {
        await astApi.deleteTrCodes(deleteList);
        setDeleteList([]);
      }
      if (changed.length > 0) await crud.saveRows();
      else await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal open={open} title="거래유형" width={620} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {edit && <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + deleteList.length }} onClick={update}>저장</Button>}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E3] selectAllButton[전체].Select (L170) → callbackResult.execute(null), hide() */}
            {!edit && <Button type="select" onClick={() => onResult(null)}>전체</Button>}
            {/* [E4] cancleButton[닫기].Select (L177) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L183) → retrieve(), [E9] searchText.KeyPress [Enter] (L214) → retrieve(). 초기화(UX-02)는 600폭에서 줄바꿈이 생겨 넣지 않는다 */}
        <SearchBar
          onSearch={retrieve}
          loading={crud.loading}
          extra={edit && (
            <>
              {/* [E7] insertButton[행 추가].Select (L195) → insertRow() */}
              <Button type="addRow" onClick={crud.addRow}>행 추가</Button>
              <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            </>
          )}
        >
          <SearchBar.Field label="거래코드/명">
            <SearchBar.Input autoFocus style={{ width: 200 }} placeholder="거래코드/명" value={text} onChange={e => setText(e.target.value)} />
          </SearchBar.Field>
          {!edit && (
            <SearchBar.Field label="수령/지급">
              <SystemCodeComboBox kindCd="RcvPayCode" altCode={[ALL, '전체']} style={{ width: 100 }}
                value={rcvPayCode} onChange={code => setRcvPayCode(code ?? ALL)} />
            </SearchBar.Field>
          )}
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TrCode> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CLICK} onRowDoubleClicked={confirm} />
        </div>
      </div>
    </Modal>
  );
};
