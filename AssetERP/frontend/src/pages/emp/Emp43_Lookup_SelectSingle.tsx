/**
 * 사원찾기(조직/직무/성명) — 인사평가 1·2차 평가자 선택 (T01) — Emp43_Tab_EvalTarget의 평가자 성명 칸에서 연다
 * AS-IS: myApp/client/vi/emp/Emp43_Lookup_SelectSingle.java (272줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L63-105: 모달 700×500 "사원찾기(조직/직무/성명)", 툴바(L84-92) 기준일 · 조직/직무/성명 · [조회], 그리드(체크박스 단일: 조직 200 · 직책 120 · 사번 80 · 성명 100 · 발령일 100),
 *   아래 가운데 [확인][미선택][닫기]. 열면 곧바로 조회(L104). 재직(transCode 100), 겸직은 재직으로 본다(isSeparateAddTitle false)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empApi, empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalTarget, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<TransInfo>();

/** buildGrid() L147-158 */
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L151
  gb.text('titleNm', 120, '직책'),  // L152
  gb.text('empNo', 80, '사번'),  // L153
  gb.text('korNm', 100, '성명'),  // L154
  gb.date('transDate', 100, '발령일'),  // L155
];

const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** open(orderNum, evalTargetModel, callback) L63 — 열 대상. null이면 닫힘. orderNum '1' = 1차 평가자, '2' = 2차 평가자 */
  target: { orderNum: '1' | '2'; model: EvalTarget } | null;
  /** callback.execute(model) — [확인]·더블클릭은 고른 사원, [미선택]은 null. 부른 쪽이 값을 반영하고 창은 이 컴포넌트가 onClose로 닫는다(hide) */
  onResult: (row: TransInfo | null) => void;
  onClose: () => void;
}

export const Emp43_Lookup_SelectSingle: React.FC<Props> = ({ target, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [baseDate, setBaseDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TransInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L160-176: emp.Emp00_TransInfo.selectByText(companyId(서버), "%검색어%", transDate, transCode "100", isSeparateAddTitle false)
  const retrieve = useCallback(async (date: string, text: string) => {
    try {
      setRows(await empApi.searchTransInfos(date, text, '100', false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L63-105 끝: settings() → baseDateField = 오늘(L107-145), show() → retrieve()
  useEffect(() => {
    if (!target) return;
    const today = dayjs().format('YYYY-MM-DD');
    setBaseDate(today);
    setSearchText('');
    setRows([]);
    void retrieve(today, '');
  }, [target, retrieve]);

  // [E7] msgBox.DialogHide [YES] (L240) → confirm() L258-263: callback.execute(model), hide()
  const confirm = (row: TransInfo) => {
    onResult(row);
    onClose();
  };

  // deleteWrite() L237-256: "저장 시 이전 평가자의 작성 내역이 삭제됩니다. 진행하시겠습니까?"(제목 "확인", 폭 520)
  const deleteWrite = (row: TransInfo) => {
    Modal.confirm({
      title: '확인',
      content: '저장 시 이전 평가자의 작성 내역이 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 520,
      onOk: () => confirm(row),
    });
  };

  // [E1] grid.CellDoubleClick (L91)·[E4] oKButton[확인].Select (L126) → confirmChk() L178-235
  const confirmChk = async () => {
    if (!target) return;
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    const before = target.orderNum === '1' ? target.model.firstEvaluatorId : target.model.secondEvaluatorId;
    // 이전 평가자가 있고 다른 사람을 고르면: emp.Emp44_EvalWrite.selectByEvaluatorId(evalTargetId, 이전 평가자) — 작성 내역이 있으면 확인 창
    if (before != null && row.personId !== before) {
      try {
        if (await empEvalApi.hasEvalWrite(target.model.evalTargetId, before)) {
          deleteWrite(row);
          return;
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    confirm(row);
  };

  return (
    <LookupModal open={target != null} title="사원찾기(조직/직무/성명)" width={790} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L126) → confirmChk() */}
            <Button type="save" onClick={confirmChk}>확인</Button>
            {/* [E5] nullButton[미선택].Select (L132) → callback.execute(null), hide() */}
            <Button type="select" onClick={() => { onResult(null); onClose(); }}>미선택</Button>
            {/* [E6] cancelButton[닫기].Select (L139) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L120) → retrieve(), [E2] searchText.KeyPress [Enter] (L112) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} allowClear={false} format="YYYY-MM-DD" value={dayjs(baseDate)}
              onChange={d => d && setBaseDate(d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="조직/직무/성명">
            <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TransInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.transId)}
            rowSelection={ROW_SELECTION}
            onRowDoubleClicked={() => void confirmChk()}
          />
        </div>
      </div>
    </LookupModal>
  );
};
