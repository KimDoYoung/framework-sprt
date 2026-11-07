/**
 * 사원별 권한현황 (EE08, Dcr04_Tab_EmpAuth 오른쪽 [사원별 권한현황]이 연다) — 왼쪽 사원 목록, 오른쪽 그 사원의 예외 문서분류와 삭제
 * AS-IS: myApp/client/vi/dcr/Dcr04_Lookup_DocList.java (155줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L54-83: 모달 1400×500(크기 고정), 왼쪽 50% = 툴바 50(검색 · 입력 200 "부서/성명/직위/사원구분" · [조회]) + 사원 그리드(부서 300 · 성명 100 · 직위 100 · 사원구분 100, 체크 다중), 오른쪽 50% = Dcr04_TabPage_DocList, 아래 [닫기]
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Typography } from 'antd';
import { dcrEmpAuthApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrEmpAuthTarget } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr04_TabPage_DocList } from './Dcr04_TabPage_DocList';

const gb = gbFor<DcrEmpAuthTarget>();

interface Props {
  open: boolean;
  /** [닫기] 단추 — AS-IS callback.execute() 뒤 hide(). 부르는 쪽이 목록을 다시 읽는다 (X로 닫으면 부르지 않는다) */
  onClosed?: () => void;
  onClose: () => void;
}

export const Dcr04_Lookup_DocList: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrEmpAuthTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [personId, setPersonId] = useState<number | null>(null);

  // retrieve() L133-146: dcr.Dcr04_EmpAuth.getTargetList(companyId는 서버가 세션에서, "%"+searchText+"%")
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await dcrEmpAuthApi.searchTargets(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L54-83) → settings() — 이벤트 연결뿐이라 아래 각 [E…]에서 처리한다
  // open(callback) L48-52: retrieve(), show() — 열 때마다 처음 모양으로 시작한다
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setPersonId(null);
    void retrieve('');
  }, [open, retrieve]);

  // buildGrid() L122-131
  const columnDefs = useMemo(() => [
    gb.text('orgName', 300, '부서'),  // L125
    gb.textCenter('personName', 100, '성명'),  // L126
    gb.textCenter('posName', 100, '직위'),  // L127
    gb.textCenter('kindName', 100, '사원구분'),  // L128
  ], []);

  // [E3] closeButton[닫기].Select (L102) → callback.execute(), hide()
  const close = () => { onClosed?.(); onClose(); };

  return (
    <LookupModal
      open={open}
      title="사원별 권한현황"
      width={1400}
      style={{ maxWidth: 'calc(100vw - 32px)' }}
      maskClosable={false}
      destroyOnHidden
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
    >
      <div style={{ height: 500 - 110, display: 'flex' }}>
        <div style={{ width: '50%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
          <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
            <Typography.Text strong style={{ flex: 'none' }}>검색</Typography.Text>
            {/* [E1] searchText.KeyPress [Enter] (L88) → retrieve() */}
            <Input style={{ width: 200, flex: 'none' }} allowClear placeholder="부서/성명/직위/사원구분" value={searchText}
              onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve(searchText)} />
            {/* [E2] retrieveButton[조회].Select (L96) → retrieve() */}
            <Button type="search" onClick={() => void retrieve(searchText)}>조회</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E4] grid.RowClick (L109) → tabPage.retrieve(고른 사원의 personId, callback: retrieve()) */}
            <MultiGrid<DcrEmpAuthTarget>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.personId)}
              loading={loading}
              rowClick
              onRowClicked={e => e.data && setPersonId(e.data.personId)}
            />
          </div>
        </div>
        <div style={{ width: '50%', height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderLeft: 'none' }}>
          <Dcr04_TabPage_DocList personId={personId} onDeleted={() => void retrieve(searchText)} />
        </div>
      </div>
    </LookupModal>
  );
};
