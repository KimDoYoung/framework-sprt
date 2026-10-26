/**
 * 담당자 변경 창 (O01) — Sch01_Tab_Info의 [담당자 변경]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch01_Lookup_ManagerModi.java (241줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L71-98: 모달 900×650 "담당자 변경", 위 툴바 50(담당자 100 조회창 트리거 · 분류 150 · 검색 150 "스케줄명/보고처" · [조회][변경]),
 *   그리드(체크 다중: 분류 150 · 스케줄명 400 · 보고처 200), 아래 가운데 [닫기]. 담당자 칸은 관리자 역할이 있는 사용자만 바꿀 수 있다(L106-115)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Select, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch01InfoManager, Sch08ClassCombo } from '@/types/sch';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sch01_Lookup_ManagerModiRun, ManagerModiRunTarget } from './Sch01_Lookup_ManagerModiRun';

const gb = gbFor<Sch01InfoManager>();

interface Props {
  open: boolean;
  /** closeButton[닫기]의 callback.execute() — 부른 쪽이 목록을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const Sch01_Lookup_ManagerModi: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const user = useLoginUser();
  const [manager, setManager] = useState<{ id: number; name: string }>({ id: user.userId, name: user.name });
  const [userManager, setUserManager] = useState(false);
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Sch01InfoManager[]>([]);
  const [lookupEmp, setLookupEmp] = useState(false);
  const [run, setRun] = useState<ManagerModiRunTarget | null>(null);
  const gridRef = useRef<AgGridReact<Sch01InfoManager>>(null);

  // 콤보를 닫는 순간에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ manager, classId, searchText });
  latest.current = { manager, classId, searchText };

  // retrieve() L195-216: sch.Sch01_Info.selectByManagerId(companyId, managerId, classId, "%검색%")
  const retrieve = useCallback(async () => {
    const c = latest.current;
    try {
      setRows(await schApi.searchInfosByManager(c.manager.id, c.classId ? Number(c.classId) : null, c.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L61-69, open L71-98) → settings() L100-169: 담당자 = 로그인 사용자, 분류 콤보 "전체"(생성 콜백 [E2] → retrieve())
  useEffect(() => {
    if (!open) return;
    const me = { id: user.userId, name: user.name };
    latest.current = { manager: me, classId: '', searchText: '' };
    setManager(me);
    setClassId('');
    setSearchText('');
    setRows([]);
    schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false));
    schApi.searchClassCombo().then(list => { setClasses(list); void retrieve(); }).catch(() => { setClasses([]); void retrieve(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] managerName.TriggerClick (L109) → openLookupManagerInfo() L171-181: Emp00_Lookup_SelectSingle.open(오늘, callback) — 이름·ID만 바꾼다(조회는 [조회])
  const onEmpResult = (row: TransInfo | null) => {
    setLookupEmp(false);
    if (row) setManager({ id: row.personId, name: row.korNm ?? '' });
  };

  // [E6] updateButton[변경].Select (L154) → update() L218-232
  const update = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('스케줄을 선택하세요');
      return;
    }
    setRun({ managerId: manager.id, managerName: manager.name, infos: checked });
  };

  const columnDefs = useMemo(() => [
    gb.text('className', 150, '분류'),
    gb.text('title', 400, '스케줄명'),
    gb.text('report', 200, '보고처'),
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="담당자 변경"
        width={940}
        maskClosable={false}
        onCancel={onClose}
        footer={(
          <div style={{ textAlign: 'center' }}>
            {/* [E7] closeButton[닫기].Select [callback != null] (L160) → callback.execute(); hide() */}
            <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 470 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>담당자</span>
            <LookupInput width={100} value={manager.name} disabled={!userManager} onOpen={() => setLookupEmp(true)} hideSearchIcon={!userManager} />
            <span>분류</span>
            {/* [E2] scheduleClassComboBox callbackOnCreate (L122) → retrieve(), [E3] Collapse (L130) → retrieve() */}
            <Select
              style={{ width: 150 }}
              value={classId}
              onChange={v => { latest.current.classId = v; setClassId(v); }}
              onOpenChange={o => { if (!o) void retrieve(); }}
              options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
            />
            <span>검색</span>
            {/* [E4] searchText.KeyPress [Enter] (L139) → retrieve() */}
            <Input
              style={{ width: 150 }}
              placeholder="스케줄명/보고처"
              allowClear
              value={searchText}
              onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }}
              onPressEnter={() => void retrieve()}
            />
            {/* [E5] retrieveButton[조회].Select (L148) → retrieve() */}
            <Button type="search" onClick={() => void retrieve()}>조회</Button>
            <Button type="change" onClick={update}>변경</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<Sch01InfoManager> gridRef={gridRef} rowClick rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)} />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle open={lookupEmp} transDate={today()} noneLabel={null} onResult={onEmpResult} onClose={() => setLookupEmp(false)} />
      <Sch01_Lookup_ManagerModiRun target={run} onClosed={() => void retrieve()} onClose={() => setRun(null)} />
    </>
  );
};
