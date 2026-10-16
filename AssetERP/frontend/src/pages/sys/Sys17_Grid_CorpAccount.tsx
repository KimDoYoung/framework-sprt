/**
 * 거래처 계좌 그리드 (A25) — Sys15_Edit_Corp 아래 "계좌정보"에 들어간다
 * AS-IS: myApp/client/vi/sys/Sys17_Grid_CorpAccount.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-74: 툴바(행 추가·행 삭제·새로고침 아이콘) + 체크박스 다중 셀 편집 그리드. 저장 버튼이 없다 — 부모 Sys15_Edit_Corp.updateRow()가 거래처를 저장한 뒤 update()를 부른다
 * 행 삭제 L126-132는 서버를 부르지 않고 deleteList에 모았다가 update()에서 보낸다(useGridCrud.removeRows)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, CorpAccount } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CorpAccount>();

/** AS-IS buildGrid() L92-111 — bankCodeComboBox Collapse(E4)가 bankCode·bankName을 함께 바꾼다 */
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
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),  // L106
  gb.textCenter('accountName', 150, '예금주명', { editor: 'text' }),  // L107
  gb.boolean('mainAccountYn', 100, '대표계좌', { editable: true }),  // L108 addBoolean — 체크해서 바꾼다
];

export interface CorpAccountHandle {
  /** AS-IS update() L144-191. corpId는 방금 저장한 새 거래처의 ID(화면이 아직 새 ID를 모를 때) */
  update: (corpId?: number) => Promise<void>;
}

interface Props {
  /** AS-IS retrieve(Long corpId) L193-210 / reset() L138-142 — null이면 비운다 */
  corpId: number | null;
  /** 같은 거래처를 다시 골라도(조회 뒤 첫 행 선택 등) 다시 조회하도록 부모가 선택한 행 객체를 준다 — AS-IS는 선택이 바뀔 때마다 retrieve(corpId) */
  corp?: object;
}

export const Sys17_Grid_CorpAccount = forwardRef<CorpAccountHandle, Props>(({ corpId, corp }, ref) => {
  const [banks, setBanks] = useState<Code[]>([]);
  const deleteList = useRef<number[]>([]);
  const columnDefs = useMemo(() => buildGrid(banks), [banks]);

  // [E0] 화면 열림 (생성자 L51-74) → settings() / ComboBoxField("BankCode") — 만들 때 조회
  useEffect(() => { sysApi.searchCodes('BankCode').then(setBanks).catch(() => setBanks([])); }, []);

  const crud = useGridCrud<CorpAccount>({
    idField: 'corpAccountId',
    search: useCallback(() => (corpId ? sysApi.searchCorpAccounts(corpId) : Promise.resolve([])), [corpId]),
    save: useCallback((rows: CorpAccount[]) => sysApi.updateCorpAccounts(corpId!, rows), [corpId]),
    remove: useCallback(async () => 0, []),  // 쓰지 않음 — 행 삭제는 deleteRow()에서 deleteList에 모은다
    // insertRow() L113-124: insertModel.setCorpId(corpId). mainAccountYn은 Boolean 기본값 false
    newRow: useCallback(() => ({ corpId: corpId ?? undefined, mainAccountYn: 'false' }), [corpId]),
    firstEditField: 'bankName',
  });

  // [E4] bankCodeComboBox[BankCode].Collapse (L94) → bankCode·bankName을 함께 바꾼다 (buildGrid의 valueSetter)
  // retrieve(corpId) L193-210: corpId가 null이면 store를 비운다 / reset() L138-142: deleteList도 비운다.
  // 거래처가 바뀔 때만 삭제 대기 목록을 비운다 (같은 거래처를 다시 읽을 때는 그대로 — AS-IS retrieve(corpId))
  const lastCorpId = useRef<number | null>(null);
  useEffect(() => {
    if (lastCorpId.current !== corpId) { deleteList.current = []; lastCorpId.current = corpId; }
    if (corpId) void crud.retrieve(); else crud.clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpId, corp]);

  // [E1] anchor.MouseDown (L56) → retrieve() L134-136 (삭제 대기 목록은 그대로 둔다 — AS-IS는 deleteList를 비우지 않는다)
  const retrieve = () => { if (corpId) void crud.retrieve(); else crud.clear(); };

  // [E2] insertButton[행 추가].Select (L78) → insertRow() L113-124
  const insertRow = () => {
    if (!corpId) {
      message.warning('거래처를 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E3] deleteButton[행 삭제].Select (L84) → deleteRow() L126-132: 체크한 행을 store에서 빼고 deleteList에 모은다
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    const ids = checked.map(r => r.corpAccountId);
    deleteList.current.push(...ids.filter(id => id > 0));
    crud.removeRows(ids);
  };

  // update() L144-191 — 대표계좌가 둘 이상이면 막고, 아니면 변경 행 저장(GridUpdate) + 삭제 대기 목록 삭제(GridDeleteData)
  const update = async (targetCorpId?: number) => {
    crud.gridRef.current?.api?.stopEditing();
    const id = targetCorpId ?? corpId;
    if (!id) return;
    if (crud.rows.filter(r => r.mainAccountYn === 'true').length > 1) {
      message.warning('대표계좌는 1개만 지정가능합니다');
      return;
    }
    try {
      if (targetCorpId && targetCorpId !== corpId) {
        // 새 거래처를 방금 저장했다: 아직 이 그리드의 corpId는 임시 ID — 저장 경로만 새 ID로
        const changed = crud.getChanged();
        if (changed.length > 0) await sysApi.updateCorpAccounts(id, changed);
      } else {
        await crud.saveRows();
      }
      if (deleteList.current.length > 0) {
        const ids = deleteList.current;
        await sysApi.deleteCorpAccounts(id, ids);
        deleteList.current = [];
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };
  useImperativeHandle(ref, () => ({ update }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <Button type="addRow" onClick={insertRow}>행 추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
        <AntButton type="text" size="small" icon={<ReloadOutlined />} onClick={retrieve} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CorpAccount> crud={crud} columnDefs={columnDefs} sortable={false} />
      </div>
    </div>
  );
});
