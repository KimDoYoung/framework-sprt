/**
 * 규정연결(직무 연관규정 매핑) 조회창 — 책무 등록(Tdm10_Tab_Task, #1412)의 연결법규·연결내규 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm11_Lookup_TaskRelateRule.java (390줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(taskId, relateType, callback) L86-108: 800×500 모달 "규정연결"(닫기 X 없음), 툴바(구분 콤보 100 · 검색 150 "규정/규정코드" · [행 추가][행 삭제] · 새로고침 아이콘)
 *   + 체크박스 다중 그리드(구분 80 · 규정 450 · 규정코드 100 · 종료일자 100) + [저장][닫기]. 구분은 열 때 호출한 아이콘대로 법규('1')·내규('2')가 골라져 있다.
 * [행 추가]는 구분에 따라 법규 고르기(Sys09_Lookup_CodeKind.tdmLawOpen)·내규 고르기(Bbs15_Lookup_CompanyRule.tdmOpen)를 열어 고른 만큼 새 줄을 더한다.
 * [행 삭제]는 줄을 화면에서만 빼 두었다가 [저장]에서 한꺼번에 지운다(deleteList). [닫기]는 변경이 남았으면 확인 뒤 닫고, callback(책무 한 건)을 불러 건수를 갱신하게 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { tdmApi, tdmTaskRelateRuleApi } from '@/api/tdm';
import { errorMessage } from '@/api/client';
import { TdmTask, TdmTaskRelateRule } from '@/types/tdm';
import { BbsCompanyRule } from '@/types/bbs';
import { CodeAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys09_Lookup_CodeKind } from '@/pages/sys/Sys09_Lookup_CodeKind';
import { Bbs15_Lookup_CompanyRule } from '@/pages/bbs/Bbs15_Lookup_CompanyRule';

const gb = gbFor<TdmTaskRelateRule>();

interface Props {
  /** AS-IS open(taskId, …) — 값이 있으면 열린다 */
  taskId: number | null;
  /** AS-IS open(…, relateType, …): '1' 법규 / '2' 내규 / 그 밖 전체 */
  relateType: string | null;
  /** [닫기] 때 불러 책무 한 건(건수가 바뀐)을 넘긴다 — AS-IS callback.execute(model) */
  onClosed: (task: TdmTask) => void;
  onClose: () => void;
}

export const Tdm11_Lookup_TaskRelateRule: React.FC<Props> = ({ taskId, relateType: openType, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmTaskRelateRule>>(null);
  const [typeCode, setTypeCode] = useState<string>('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmTaskRelateRule[]>([]);
  const [deleteList, setDeleteList] = useState<TdmTaskRelateRule[]>([]);
  const [lawOpen, setLawOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const tempSeq = useRef(0);
  const open = taskId != null;

  // retrieve() L222-238: deleteList를 비우고 tdm.Tdm11_TaskRelateRule.selectBySearchText(companyId, taskId, relateType, searchText "%글자%")
  const retrieve = useCallback(async (type: string, text: string) => {
    if (taskId == null) return;
    setDeleteList([]);
    try {
      setRows(await tdmTaskRelateRuleApi.search(taskId, type, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [taskId]);

  // [E0] 화면 열림 (open L86-108) · [E1] relateTypeComboBox.callbackOnCreate (L111): 호출한 아이콘대로 법규·내규를 고르고 retrieve()
  useEffect(() => {
    if (!open) return;
    const type = openType === '1' || openType === '2' ? openType : '%';
    setTypeCode(type);
    setSearchText('');
    setRows([]);
    void retrieve(type, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isNew = (r: TdmTaskRelateRule) => r.taskRelateRuleId < 0;
  const hasChanges = deleteList.length > 0 || rows.some(isNew);

  // insertRow() L240-306: 구분이 전체면 "구분을 선택하세요", 법규면 법규목록 창, 내규면 내부규정 창 → 고른 만큼 새 줄(GridInsertRow, 맨 아래)
  const insertRow = () => {
    if (typeCode === '%') { message.warning('구분을 선택하세요'); return; }
    if (typeCode === '1') setLawOpen(true);
    else if (typeCode === '2') setRuleOpen(true);
  };
  const addRows = (type: '1' | '2', picked: { code: string; name: string }[]) => {
    if (taskId == null) return;
    const added: TdmTaskRelateRule[] = picked.map(p => ({
      taskRelateRuleId: --tempSeq.current,
      taskId,
      relateType: type,
      relateTypeName: type === '1' ? '법규' : '내규',
      ruleCode: p.code,
      ruleName: p.name,
      closeDate: null,
    }));
    setRows(prev => [...prev, ...added]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      if (api && added.length > 0) api.ensureIndexVisible(api.getDisplayedRowCount() - 1);
    }, 0);
  };
  const onLawResult = (codes: CodeAdmin[]) => { setLawOpen(false); addRows('1', codes.map(c => ({ code: c.code, name: c.name }))); };
  const onRuleResult = (rules: BbsCompanyRule[]) => { setRuleOpen(false); addRows('2', rules.map(r => ({ code: r.companyRuleCode ?? '', name: r.title ?? '' }))); };

  // deleteRow() L308-319: 선택이 없으면 "삭제할 내역을 선택하세요", 선택한 줄은 deleteList에 넣고 화면에서 뺀다
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 내역을 선택하세요'); return; }
    setDeleteList(prev => [...prev, ...checked.filter(r => !isNew(r))]);
    const gone = new Set(checked.map(r => r.taskRelateRuleId));
    setRows(prev => prev.filter(r => !gone.has(r.taskRelateRuleId)));
  };

  // update() L321-358 · updateEnd() L360-365: 변경이 없으면 "변경된 내역이 없습니다", 있으면 새 줄 저장(tdm.Tdm11_TaskRelateRule.update) · 지운 줄 삭제(delete) → "저장이 완료되었습니다" 뒤 다시 조회
  const update = async () => {
    if (taskId == null) return;
    const added = rows.filter(isNew);
    if (added.length === 0 && deleteList.length === 0) { message.warning('변경된 내역이 없습니다'); return; }
    try {
      if (added.length > 0) await tdmTaskRelateRuleApi.add(added.map(r => ({ taskId, relateType: r.relateType, ruleCode: r.ruleCode ?? '' })));
      if (deleteList.length > 0) await tdmTaskRelateRuleApi.delete(deleteList.map(r => r.taskRelateRuleId));
      message.success('저장이 완료되었습니다');
      await retrieve(typeCode, searchText);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // close() L367-382: callback이 있으면 tdm.Tdm10_Task.selectById(taskId) 결과를 넘기고 hide()
  const close = async () => {
    if (taskId != null) {
      try {
        onClosed(await tdmApi.getTask(taskId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    }
    onClose();
  };

  // [E8] closeButton[닫기].Select (L182): 변경이 남았으면 "반영되지 않은 변경사항이 존재합니다. 그냥 닫으시겠습니까?"(폭 450) → [E9] msgBox.DialogHide [YES] (L188) → close()
  const closeButton = () => {
    if (!hasChanges) { void close(); return; }
    Modal.confirm({
      title: '확인',
      content: '반영되지 않은 변경사항이 존재합니다. 그냥 닫으시겠습니까?',
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: () => close(),
    });
  };

  // buildGrid() L211-220 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.textCenter('relateTypeName', 80, '구분'),  // L214
    gb.text('ruleName', 450, '규정'),  // L215
    gb.text('ruleCode', 100, '규정코드'),  // L216
    gb.date('closeDate', 100, '종료일자'),  // L217
  ], []);

  return (
    <>
      {/* 열 폭 합계 80+450+100+100 = 730 + 행번호·체크 60 + 여백 130 = 920 — AS-IS 800보다 작지 않게 (03 원칙 21) */}
      <LookupModal
        open={open}
        title="규정연결"
        width={920}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={closeButton}
        destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E7] updateButton[저장].Select (L176) → update() */}
            <Button type="save" onClick={update}>저장</Button>
            <Button type="close" onClick={closeButton} style={{ marginLeft: 8 }}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 'min(440px, calc(100vh - 260px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>구분</span>
            {/* [E2] relateTypeComboBox[Ruletype].Collapse (L127) → retrieve() */}
            <SystemCodeComboBox kindCd="Ruletype" altCode={['%', '전체']} style={{ width: 100 }} value={typeCode}
              onChange={code => { const v = code ?? '%'; setTypeCode(v); void retrieve(v, searchText); }} />
            <span style={{ marginLeft: 8 }}>검색</span>
            {/* [E3] searchText.KeyPress [Enter] (L136) → retrieve() */}
            <Input allowClear style={{ width: 150 }} placeholder="규정/규정코드" value={searchText}
              onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve(typeCode, searchText)} />
            {/* [E5] insertButton[행 추가].Select (L164) → insertRow() */}
            <Button type="addRow" onClick={insertRow}>행 추가</Button>
            {/* [E6] deleteButton[행 삭제].Select (L170) → deleteRow() */}
            <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            {/* [E4] anchor.MouseDown (L147) → retrieve() — 새로고침 이미지 링크 */}
            <a role="button" title="새로고침" onClick={() => void retrieve(typeCode, searchText)} style={{ fontSize: 15, color: '#595959', cursor: 'pointer' }}><ReloadOutlined /></a>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* 삭제용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
            <MultiGrid<TdmTaskRelateRule>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.taskRelateRuleId)}
            />
          </div>
        </div>
      </LookupModal>
      {/* 법규연결 L247-275: Sys09_Lookup_CodeKind.tdmLawOpen(taskId, callback) */}
      <Sys09_Lookup_CodeKind open={lawOpen} kindCode="TdmLawCode" taskId={taskId} onResult={onLawResult} onClose={() => setLawOpen(false)} />
      {/* 내규연결 L277-305: Bbs15_Lookup_CompanyRule.tdmOpen(taskId, callback) */}
      <Bbs15_Lookup_CompanyRule open={ruleOpen} taskId={taskId} onResult={onRuleResult} onClose={() => setRuleOpen(false)} />
    </>
  );
};
