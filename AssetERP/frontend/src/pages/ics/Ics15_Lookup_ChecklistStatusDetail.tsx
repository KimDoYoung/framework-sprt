/**
 * 법규통제 체크리스트 상세 (K07) — Ics15_Tab_ChecklistStatus 그리드의 '월'·'분기' 칸을 더블클릭하면 연다.
 * AS-IS: myApp/client/vi/ics/Ics15_Lookup_ChecklistStatusDetail.java (205줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-103: 모달 1600×700, 툴바(미체크 보기 · 미확인 보기 · [조회]) / 그리드(그 체크리스트의 담당자별 내역) / [닫기].
 * 열릴 때 view() L55-77이 받은 기준년도·월(분기)·체크주기·체크리스트로 바로 조회한다. 체크박스는 값이 바뀌어도 조회하지 않고 [조회]를 눌러야 반영된다(원본 그대로).
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistStatusDetail } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { getDate } from './icsComplyPeriod';

const gb = gbFor<IcsChecklistStatusDetail>();

export interface ChecklistStatusDetailTarget {
  /** view(yyyyStr, periodStr, cycleStr, checklistId) L55-77 — 조회년도·월(분기) 코드('03'·'1')·체크주기·체크리스트 */
  year: string;
  period: string;
  cycleType: string;
  checklistId: number;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: ChecklistStatusDetailTarget | null;
  onClose: () => void;
}

export const Ics15_Lookup_ChecklistStatusDetail: React.FC<Props> = ({ target, onClose }) => {
  const [unCheckYn, setUnCheckYn] = useState(false);  // "미체크 보기"
  const [unConfirmYn, setUnConfirmYn] = useState(false);  // "미확인 보기"
  const [rows, setRows] = useState<IcsChecklistStatusDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);
  const view = useRef({ unCheckYn, unConfirmYn });
  view.current = { unCheckYn, unConfirmYn };

  // retrieve() L154-172: ics.Ics11_ChecklistCompany.selectByChecklistIdStatus (기준 월(분기)의 말일, 체크주기, 체크리스트, 미체크·미확인 보기)
  const retrieve = async (t: ChecklistStatusDetailTarget, over?: { unCheckYn: boolean; unConfirmYn: boolean }) => {
    const std = getDate(t.year, t.period, t.cycleType);
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await icsApi.searchChecklistStatusByChecklist(t.checklistId, {
        stdDate: std.format('YYYY-MM-DD'),
        cycleType: t.cycleType,
        unCheckYn: over?.unCheckYn ?? view.current.unCheckYn,
        unConfirmYn: over?.unConfirmYn ?? view.current.unConfirmYn,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E0] 화면 열림 (생성자 L79-103) → settings(), show(). view() L55-77: 체크박스를 끄고 바로 조회한다
  useEffect(() => {
    if (!target) return;
    setUnCheckYn(false);
    setUnConfirmYn(false);
    setRows([]);
    void retrieve(target, { unCheckYn: false, unConfirmYn: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // buildGrid() L125-152 — 열 순서·폭·제목은 원본 그대로
  const columnDefs = [
    gb.text('checkLClassName', 100, '대분류'),
    gb.text('checkMClassName', 200, '중분류'),
    gb.textArea('content', 550, '체크대상'),
    // View 아이콘: Ics10_Edit_Checklist.open(selectModel.getChecklistModel(), callback) — callback은 비어 있다
    iconCell<IcsChecklistStatusDetail>('view', 'viewCell', 40, ' ', row => setViewTarget({ model: row })),
    gb.textArea('reason', 280, '체크결과'),
    gb.text('orgName', 100, '담당부서'),
    gb.textCenter('personName', 100, '담당자'),
    gb.textCenter('confirmerName', 100, '확인자'),
    gb.booleanYn('confirmYn', 65, '확인여부'),
  ];

  return (
    <LookupModal
      open={!!target}
      title="법규통제 체크리스트 상세"
      width={1250}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancleButton[닫기].Select (L117) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
        {/* [E1] retrieveButton[조회].Select (L111) → retrieve() */}
        <SearchBar onSearch={() => { if (target) void retrieve(target); }} loading={loading}>
          <Checkbox checked={unCheckYn} onChange={e => setUnCheckYn(e.target.checked)}>미체크 보기</Checkbox>
          <Checkbox checked={unConfirmYn} onChange={e => setUnConfirmYn(e.target.checked)}>미확인 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsChecklistStatusDetail>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.checklistId}-${p.data.personId}`}
            loading={loading}
          />
        </div>
      </div>
      {/* 체크리스트 보기 창(읽기 전용) */}
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClose={() => setViewTarget(null)} />
    </LookupModal>
  );
};
