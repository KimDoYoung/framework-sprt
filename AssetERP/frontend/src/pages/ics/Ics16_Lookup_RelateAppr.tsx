/**
 * 내부통제 체크리스트 상신 (K06) — Ics15_Tab_ChecklistConfirm의 [상신]이 연다.
 * AS-IS: myApp/client/vi/ics/Ics16_Lookup_RelateAppr.java (538줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L106-132: 모달 710×350, 툴바(분기(월): 기준년도 · 월/분기 콤보 · [조회]) / 그리드(대분류별 전체건수·확인건수·미리보기·결재상태·결재요청·문서보기) / [닫기].
 * 1단계: 조회·상신 전 검사(건수 일치, 결재상태 안내)까지. [미리보기](RD)·[결재요청]의 문서분류 선택~PDF 첨부~전자결재 상신·[문서보기](결재 편집창)는
 * 전자결재·RD에 걸려 있어 다음 단계에서 연결한다(안내만).
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistRelateAppr } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { getDate } from './icsComplyPeriod';

const gb = gbFor<IcsChecklistRelateAppr>();
const NEXT_STEP = '전자결재 상신(문서분류 선택·PDF 첨부·결재 문서 창)은 다음 단계에서 연결합니다.';

export interface RelateApprTarget {
  /** open(yyyyStr, periodStr, cycleStr, callback) L77-104 — 부모 화면의 기준년도·월/분기 코드·체크주기 */
  year: string;
  period: string;
  cycleType: string;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: RelateApprTarget | null;
  onClose: () => void;
}

export const Ics16_Lookup_RelateAppr: React.FC<Props> = ({ target, onClose }) => {
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [rows, setRows] = useState<IcsChecklistRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const view = useRef({ year, period });
  view.current = { year, period };

  // retrieve() L211-232: ics.Ics16_RelateAppr.selectByConfirmerId (기준 분기(월)의 말일, 체크주기). 조회한 행을 돌려준다(결재요청의 건수 검사에 쓴다)
  const retrieve = async (over?: { year: string; period: string; cycleType: string }): Promise<IcsChecklistRelateAppr[] | null> => {
    const cycleType = over?.cycleType ?? target?.cycleType;
    if (!cycleType) return null;
    const std = getDate(over?.year ?? view.current.year, over?.period ?? view.current.period, cycleType);
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return null; }
    setLoading(true);
    try {
      const list = await icsApi.searchChecklistRelateApprs(std.format('YYYY-MM-DD'), cycleType);
      setRows(list);
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L106-132) → settings(), show(). open() L77-104: 받은 기준년도·월/분기를 채우고 콤보를 읽은 뒤 retrieve()
  useEffect(() => {
    if (!target) return;
    setYear(target.year);
    setPeriod(target.period);
    setRows([]);
    void retrieve(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // 결재요청 아이콘 actionCell L158: isCountCheck = true → retrieve() → checkCount() L234-244 → apprCheck() L269-305
  const requestAppr = async (row: IcsChecklistRelateAppr) => {
    const list = await retrieve();
    const cur = list?.find(r => r.checklistLClassId === row.checklistLClassId);
    if (!cur) return;
    // checkCount(): 전체건수와 확인건수가 같아야 상신할 수 있다
    if (cur.totalCount !== cur.confirmCount) { message.info('전체건수와 확인건수가 같아야 상신이 가능합니다'); return; }
    // apprCheck(): 결재문서가 없으면 linkCheck(null)
    if (cur.apprId == null) { message.info(NEXT_STEP); return; }
    if (cur.statusCode === '10' || cur.statusCode === '20') { message.info('결재진행 중인 문서가 존재합니다'); return; }  // 10:상신, 20:결재 중
    if (cur.statusCode === '99') { message.info(NEXT_STEP); return; }  // 99:임시저장 → linkCheck(apprId)
    Modal.confirm({
      title: '확인',
      content: '진행시 기존문서는 폐기됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 600,
      onOk: () => { message.info(NEXT_STEP); },  // [E3] msgBox.DialogHide [YES] (L287) → linkCheck(apprId) — 다음 단계
    });
  };

  // 문서보기 아이콘 viewCell L164: 결재문서가 없으면 안내, 있으면 Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
  const viewAppr = (row: IcsChecklistRelateAppr) => {
    if (row.apprId == null) { message.info('상신문서가 존재하지않습니다'); return; }
    message.info(NEXT_STEP);
  };

  // buildGrid() L152-209 — 열 순서·폭·제목은 원본 그대로
  const columnDefs = [
    gb.text('checkLClassName', 220, '대분류'),
    gb.long('totalCount', 80, '전체건수'),
    gb.long('confirmCount', 80, '확인건수'),
    // rdViewCell L153 → viewRd(): insertRdChecklistDetail → RD 뷰어 (다음 단계)
    iconCell<IcsChecklistRelateAppr>('view', 'rdViewCell', 60, '미리보기', () => { message.info('미리보기 리포트는 다음 단계에서 연결합니다.'); }),
    gb.textCenter('statusName', 80, '결재상태'),
    iconCell<IcsChecklistRelateAppr>('edit', 'apprCell', 60, '결재요청', row => { void requestAppr(row); }),
    iconCell<IcsChecklistRelateAppr>('view', 'viewCell', 60, '문서보기', viewAppr),
  ];

  return (
    <LookupModal
      open={!!target}
      title="내부통제 체크리스트 상신"
      width={770}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancleButton[닫기].Select (L144) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L138) → retrieve() */}
        <SearchBar onSearch={() => { void retrieve(); }} loading={loading}>
          <Space size={6}>
            <span>분기(월)</span>
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {target != null && (
              <SystemCodeComboBox
                kindCd={target.cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onChange={code => { if (code) setPeriod(code); }}
              />
            )}
          </Space>
        </SearchBar>
        <div style={{ height: 220 }}>
          <SingleGrid<IcsChecklistRelateAppr>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.relateApprId)}
            loading={loading}
          />
        </div>
      </div>
    </LookupModal>
  );
};
