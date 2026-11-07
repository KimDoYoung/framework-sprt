/**
 * 법규분류 선택창 (EE68) — 내부통제 관리(법규별 문서작성)의 [신규문서 작성] 뒤, 새 전자결재 문서에 붙일 연관법규를 고른다.
 * AS-IS: myApp/client/vi/apr/Apr20_Lookup_SelectIcs.java (188줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-93: 800×450 모달 "법규분류", 체크박스 다중 그리드(구분 50 · 법규 450 · 주기 80 · 상세보기 60 · 삭제 60), 푸터 가운데 [확인][닫기]
 * open(classTreeModel, apprModel, icsClassTreeModel, callback) L43-46 → retriveIcsLine() L95-108: apr.Apr20_RelateIcs.insertIcs(문서분류·고른 법규)
 *   ※ 오늘의 할일에서 상신하는 두 번째 open(…, Sch04_ListModel, …) L49-57·retriveIcsLine L110-124·createIcsLine L126-141은 AS-IS 호출처(Sch04_Tab_ToDoList.insertAppr)가 주석이라 만들지 않았다
 * 내규판(Apr22_Lookup_SelectIcr, EE69)은 `kind="icr"`로 같은 부품을 쓴다 — 법규 → 내규, ics → icr
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprRelateIcsRow, AprRelateSelect } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr20_Lookup_RelateIcs } from './Apr20_Lookup_RelateIcs';

const gb = gbFor<AprRelateSelect>();

/** 상세보기 창(Apr20_Lookup_RelateIcs.view)이 읽는 모양으로 */
const toViewRow = (r: AprRelateSelect): AprRelateIcsRow => ({
  relateIcsId: r.relateId, classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName, content: r.content, submitTo: r.submitTo,
  relatedLaw: r.relatedLaw, deadlineId: r.deadlineId, deadlineFullName: r.deadlineFullName, deadlineNote: r.deadlineNote, cycleName: r.cycleName,
  standCode: null, standDate: null, closeDate: r.closeDate, standYn: null,
});

interface Props {
  /** 값이 있으면 열린다 — 상신하는 문서분류(dcrClassTreeId)와 고른 법규/내규(classTreeId) */
  target: { dcrClassTreeId: number; classTreeId: number } | null;
  /** 'icr'이면 내규분류(Apr22_Lookup_SelectIcr) */
  kind?: 'ics' | 'icr';
  /** update() L175-183: callBack.execute(체크된 줄) 뒤 hide() */
  onResult: (rows: AprRelateSelect[]) => void;
  onClose: () => void;
}

export const Apr20_Lookup_SelectIcs: React.FC<Props> = ({ target, kind = 'ics', onResult, onClose }) => {
  const label = kind === 'icr' ? '내규' : '법규';
  const [rows, setRows] = useState<AprRelateSelect[]>([]);
  const [checked, setChecked] = useState<AprRelateSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewRow, setViewRow] = useState<AprRelateIcsRow | null>(null);

  // retriveIcsLine() L95-108 — apr.Apr20_RelateIcs.insertIcs (줄마다 새 번호)
  const retrieve = useCallback(async () => {
    if (target == null) return;
    setLoading(true);
    try {
      setRows(kind === 'icr'
        ? await aprRelateEditApi.selectRelateIcr(target.dcrClassTreeId, target.classTreeId)
        : await aprRelateEditApi.selectRelateIcs(target.dcrClassTreeId, target.classTreeId));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target, kind]);

  // [E0] 화면 열림 (생성자 L59-93) → show(), retriveIcsLine()
  useEffect(() => {
    if (target == null) { setRows([]); setChecked([]); return; }
    void retrieve();
  }, [target, retrieve]);

  // [E1] updateButton[확인].Select (L66) → update() L175-183
  const update = () => {
    if (checked.length === 0) {
      message.info(`${label}를 선택해주세요`);
      return;
    }
    onResult(checked);
  };

  // buildGrid() L144-173
  const columnDefs = useMemo(() => [
    gb.textCenter('scheduleCodeCheck', 50, ''),  // L166 "참고"
    gb.textArea('classTreeFullName', 450, label),  // L167
    gb.text('cycleName', 80, '주기'),  // L168
    // L169 viewCell(View): Apr20_Lookup_RelateIcs.view(그 줄)
    iconCell<AprRelateSelect>('view', 'viewCell', 60, '상세보기', row => setViewRow(toViewRow(row))),
    // L170 deleteCell(Delete): GridDeleteData.delete(store, 체크된 줄, "apr.Apr20_RelateIcs.delete") — 아직 저장 전인 줄이라 화면에서만 뺀다
    iconCell<AprRelateSelect>('delete', 'deleteCell', 60, '삭제', () => {
      const ids = new Set(checked.map(r => r.relateId));
      setRows(prev => prev.filter(r => !ids.has(r.relateId)));
      setChecked([]);
    }),
  ], [label, checked]);

  return (
    <>
      <LookupModal
        open={target != null}
        title={`${label}분류`}
        // 열 폭 합계 50+450+80+60+60 = 700 + 체크·행번호 60 + 여백 130 = 890 (AS-IS 800보다 작지 않게, 03 원칙 21)
        width={890}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E2] cancleButton[닫기].Select (L72) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 300 }}>
          <MultiGrid<AprRelateSelect> rowClick rowData={rows} columnDefs={columnDefs} loading={loading}
            getRowId={p => String(p.data.relateId)} onCheckedChange={setChecked} />
        </div>
      </LookupModal>
      <Apr20_Lookup_RelateIcs row={viewRow} view kind={kind} onSet={() => undefined} onClose={() => setViewRow(null)} />
    </>
  );
};
