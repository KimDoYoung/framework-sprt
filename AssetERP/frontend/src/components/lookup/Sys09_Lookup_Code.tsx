/**
 * 코드추가 조회창 (A34 연결, sys 도메인이지만 dcr·pln·rpt도 쓰는 공용 팝업이라 components/lookup) — Sys95_Tab_ManualAdmin의 "분류추가"에서 연다
 * AS-IS: myApp/client/vi/sys/Sys09_Lookup_Code.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit(codeKind, callback) L76-112: 모달 650×500 "코드추가", 툴바(행 추가 · 행 삭제 · 새로고침 아이콘) + 셀 편집 그리드(코드·코드명·조회순서),
 *   하단 저장 · 닫기. 읽기 전용 두 열(index 1·2)은 edit에서 숨겨진다. 삭제는 deleteList에 모았다가 저장 때 보낸다.
 * 아직 없음: 코드구분별 사용이력 검사 중 SpecialLeaveCode·DocFormClassCode·WeekBizType(다른 도메인 emp·dcr·rpt) — 서버가 거절한다.
 *   `open(…)`(선택 모드)의 확인(okButton, E6)도 edit에서는 버튼이 없어 옮기지 않았다.
 * UX보강(10): 해당 없음(검색 조건이 없다). 저장(n)도 안 쓴다 — deleteList만 있어도 저장해야 하고 0건이면 원본 안내문을 띄운다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CodeAdmin, CodeKind } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<CodeAdmin>();

/** AS-IS buildGrid() L186-196 — edit()가 앞의 읽기 전용 두 열을 숨겨 편집 열 셋만 남는다 */
const buildGrid = () => [
  gb.text('code', 70, '코드', { editor: 'text' }),  // L190
  gb.text('name', 400, '코드명', { editor: 'text' }),  // L191
  gb.text('seq', 70, '조회순서', { editor: 'text' }),  // L192
];

/** updateEnd() L427-436: 이 코드구분들은 저장·삭제 뒤 callback.execute(null) */
const NOTIFY_KINDS = ['DocFormClassCode', 'ManualType', 'WeekBizType'];
/** deleteRow() L234-324: 사용이력을 검사하는 코드구분 — ManualType만 옮겼다 */
const CHECK_UNSUPPORTED = ['SpecialLeaveCode', 'DocFormClassCode', 'WeekBizType'];

interface Props {
  open: boolean;
  /** edit(codeKind, …)의 codeKind (예: 'ManualType') */
  codeKind: string;
  /** 더블클릭 → 그 행, 저장·삭제 끝(NOTIFY_KINDS) → null. 닫기는 onClose */
  onResult: (code: CodeAdmin | null) => void;
  onClose: () => void;
}

export const Sys09_Lookup_Code: React.FC<Props> = ({ open, codeKind, onResult, onClose }) => {
  const user = useLoginUser();
  const [kind, setKind] = useState<CodeKind | null>(null);
  const columnDefs = useMemo(buildGrid, []);
  /** 불러온 코드 (AS-IS preUpdate L326-368이 바뀐 코드를 가리는 orgCode) */
  const orig = useRef(new Map<number, string>());
  /** AS-IS deleteList — deleteRow()가 모았다가 update() 때 sys.Sys09_Code.delete로 보낸다 */
  const deleted = useRef<CodeAdmin[]>([]);

  const crud = useGridCrud<CodeAdmin>({
    idField: 'codeId',
    // retrieve() L198-215: deleteList를 비우고 sys.Sys09_Code.selectByCodeKind(회사·codeKind·오늘)
    search: useCallback(async () => {
      deleted.current = [];
      const list = await sysApi.searchCodesByKindCode(codeKind);
      orig.current = new Map(list.map(r => [r.codeId, r.code]));
      return list;
    }, [codeKind]),
    // update() L390-425: GridUpdate → sys.Sys09_Code.update
    save: sysApi.updateCodeAdmins,
    remove: useCallback(async () => 0, []),  // 삭제는 deleteRow()가 deleteList에 모은다(deleteChecked를 쓰지 않음)
    // insertRow() L217-232: 시스템이면 회사 0, 아니면 로그인 회사 · 코드구분 · 시작일 1900-01-01
    newRow: useCallback(() => ({
      companyId: kind?.sysYn === 'true' ? 0 : user.companyId,
      codeKindId: kind?.codeKindId,
      applyDate: '1900-01-01',
    }), [kind, user.companyId]),
    firstEditField: 'code',
  });

  // edit() L76-112: sys.Sys08_CodeKind.selectByKindCode → setting() → show(), retrieve()
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setKind(null);
    sysApi.getCodeKindByCode(codeKind).then(k => {
      if (!alive) return;
      setKind(k);
      void crud.retrieve();
    }).catch(err => message.error(errorMessage(err, '코드구분 조회 실패')));
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, codeKind]);

  const selectedRows = () => crud.gridRef.current?.api.getSelectedRows() ?? [];

  // [E3] insertButton[행 추가].Select (L144) → insertRow()
  const insertRow = () => {
    if (!kind) return;
    crud.addRow();
  };

  // [E4] deleteButton[행 삭제].Select (L150) → deleteRow() L234-324: 사용이력 검사 → 통과한 행을 grid에서 빼고 deleteList에 모은다
  const deleteRow = async () => {
    const checked = selectedRows();
    if (CHECK_UNSUPPORTED.includes(codeKind)) {
      message.warning('이 코드구분의 사용이력 검사는 아직 변환되지 않았습니다');
      return;
    }
    const passed: CodeAdmin[] = [];
    for (const model of checked) {
      if (codeKind === 'ManualType') {  // sys.Sys95_Manual.checkManualType
        try {
          await sysApi.checkManualType(model.code);
        } catch (err) {
          message.warning(errorMessage(err, '사용중인 코드는 삭제 불가합니다'));
          break;
        }
      }
      passed.push(model);
    }
    if (passed.length === 0) return;
    deleted.current.push(...passed.filter(m => m.codeId > 0));
    crud.removeRows(passed.map(m => m.codeId));
  };

  // [E5] updateButton[저장].Select (L156) → preUpdate() L326-368 → (바뀐 코드가 있으면) checkCode() L370-388 → update() L390-425
  const preUpdate = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length + deleted.current.length === 0) {
      message.warning('저장 및 삭제 내역이 없습니다.');
      return;
    }
    for (const r of changed) {
      if (!r.code) { message.warning('코드를 입력하세요'); return; }
      if (!r.name) { message.warning('코드명을 입력하세요'); return; }
      if (!r.seq) { message.warning('조회순서를 입력하세요'); return; }
    }
    // 코드가 바뀐 행(신규 포함)은 사용이력·중복을 서버에서 검사
    const checkList = changed.filter(r => r.code !== orig.current.get(r.codeId));
    if (checkList.length > 0) {
      try {
        await sysApi.checkCodes(codeKind, checkList.map(r => ({ codeId: r.codeId, code: r.code })));
      } catch (err) {
        message.warning(errorMessage(err, '코드 검사 실패'));
        return;
      }
    }
    await update(changed.length > 0);
  };

  // update() L390-425: 저장(GridUpdate)과 삭제(GridDeleteData) 둘 다 끝나면 updateEnd()
  const update = async (hasChanged: boolean) => {
    if (hasChanged) {
      await crud.saveRows();
      if (crud.hasChanges()) return;  // 저장 실패(saveRows가 오류 문구를 띄움) — 삭제·updateEnd 안 함
    }
    if (deleted.current.length > 0) {
      const list = deleted.current;
      try {
        const n = await sysApi.deleteCodeAdmins(list[0].companyId, list.map(m => m.codeId));
        deleted.current = [];
        message.success(`${n}건 삭제되었습니다.`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
        return;
      }
    }
    // updateEnd() L427-436
    if (NOTIFY_KINDS.includes(codeKind)) onResult(null);
  };

  return (
    <Modal
      open={open}
      title="코드추가"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] updateButton[저장].Select (L156) → preUpdate(). 저장(n)(UX-03)은 쓰지 않는다 — 삭제만 쌓인 때(deleteList)도 눌러야 하고 변경이 없으면 원본 문구를 띄운다 */}
            <Button type="save" onClick={preUpdate}>저장</Button>
            {/* [E7] cancelButton[닫기].Select (L172) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Button type="addRow" onClick={insertRow}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          {/* [E1] anchor.MouseDown (L88) → retrieve() — 새로고침 아이콘 */}
          <a onMouseDown={() => void crud.retrieve()} style={{ cursor: 'pointer', color: '#555' }}><ReloadOutlined /></a>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L136) → callback.execute(선택 행), hide() */}
          <CellEditGrid<CodeAdmin> crud={crud} columnDefs={columnDefs} sortable={false}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDoubleClicked={e => { if (e.data) { onResult(e.data); onClose(); } }} />
        </div>
      </div>
    </Modal>
  );
};
