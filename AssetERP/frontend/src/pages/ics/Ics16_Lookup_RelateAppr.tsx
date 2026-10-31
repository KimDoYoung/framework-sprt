/**
 * 내부통제 체크리스트 상신 (K06) — Ics15_Tab_ChecklistConfirm의 [상신]이 연다.
 * AS-IS: myApp/client/vi/ics/Ics16_Lookup_RelateAppr.java (538줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L106-132: 모달 710×350, 툴바(분기(월): 기준년도 · 월/분기 콤보 · [조회]) / 그리드(대분류별 전체건수·확인건수·미리보기·결재상태·결재요청·문서보기) / [닫기].
 * 1단계: 조회·상신 전 검사(건수 일치, 결재상태 안내). V19: [결재요청]의 문서분류 선택 → 결재 편집창(A27) → 상신 연결 기록(updateApprId, 이전 문서 폐기)과 [문서보기](결재 편집창)를 연결했다.
 * 남은 것(다음 단계): [미리보기](RD)와 createRd()의 RD 첨부 PDF 만들기 — TOBE에는 RD 리포트·PDF 엔진이 없다. AS-IS도 파일 저장 경로가 없는 환경(개발계)에서는
 * PDF 없이 바로 결재 편집창을 여는데(createRd L462-463) TOBE는 그 경로만 간다.
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
import { dcrApi } from '@/api/dcr';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { getDate } from './icsComplyPeriod';

const gb = gbFor<IcsChecklistRelateAppr>();
const LINK_CODE = 'A27';  // linkCheck()의 dcr.Dcr30_Link.selectByLinkCode · insertLinkApproval(…, "A27", …)

/** 결재요청을 누른 행 — AS-IS 필드 checklistLClassId·lastApprId·selectModel(yyyy·mm 채움) */
interface ApprRequest {
  row: IcsChecklistRelateAppr;
  lastApprId: number | null;
  year: string;
  period: string;
  /** periodComboBox.getCurrentValue() — AS-IS selectModel.setMm에 들어가는 콤보의 이름(예 '09월') */
  periodName: string;
  cycleType: string;
  /** 문서분류를 고른 뒤 값이 생긴다 */
  classTreeId: number | null;
}

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
  const [periodName, setPeriodName] = useState('');
  const [classPick, setClassPick] = useState<{ req: ApprRequest; defaultClassTreeId: number | null } | null>(null);  // linkCheck() → Dcr01_Lookup_Class
  const [linkDoc, setLinkDoc] = useState<ApprRequest | null>(null);  // insertLinkApproval() → Apr01_Edit_ApprDoc
  const [viewApprId, setViewApprId] = useState<number | null>(null);  // viewCell → Apr01_Edit_ApprDoc.retrieveApproval
  const view = useRef({ year, period, periodName });
  view.current = { year, period, periodName };

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
    // apprCheck() L269-305: 결재문서가 없으면 linkCheck(null)
    const cycleType = target?.cycleType ?? '';
    const base = { row: cur, year: view.current.year, period: view.current.period, periodName: view.current.periodName, cycleType, classTreeId: null as number | null };
    if (cur.apprId == null) { void linkCheck({ ...base, lastApprId: null }); return; }
    if (cur.statusCode === '10' || cur.statusCode === '20') { message.info('결재진행 중인 문서가 존재합니다'); return; }  // 10:상신, 20:결재 중
    if (cur.statusCode === '99') { void linkCheck({ ...base, lastApprId: cur.apprId }); return; }  // 99:임시저장
    Modal.confirm({
      title: '확인',
      content: '진행시 기존문서는 폐기됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 600,
      onOk: () => { void linkCheck({ ...base, lastApprId: cur.apprId }); },  // [E4] msgBox.DialogHide [YES] (L287) → linkCheck(apprId)
    });
  };

  // linkCheck() L307-341: dcr.Dcr30_Link.selectByLinkCode(A27) — 없으면 빈 Dcr01_Lookup_Class, 있으면 첫 분류를 채운 Dcr01_Lookup_Class → [확인] → createRd(classTreeModel)
  const linkCheck = async (req: ApprRequest) => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      setClassPick({ req, defaultClassTreeId: list.length === 0 ? null : list[0].classTreeId });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // createRd() L430-513: Sys99_Print.insertRdChecklistDetail → RD로 첨부 PDF 저장 → insertLinkApproval(). RD 첨부는 다음 단계(위 머리 설명)라 파일 경로가 없을 때의 길(L462-463)만 간다
  const createRd = (req: ApprRequest, classTreeId: number) => {
    setLinkDoc({ ...req, classTreeId });
  };

  // updateApprId() L361-382: ics.Ics16_RelateAppr.updateApprId(checkYyyymm, cycleType, checklistLClassId, apprId, lastApprId, empId) → "상신완료 되었습니다" → callback.execute(), retrieve()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    const std = getDate(linkDoc.year, linkDoc.period, linkDoc.cycleType);
    if (!std) return;
    try {
      await icsApi.updateChecklistRelateApprId({
        stdDate: std.format('YYYY-MM-DD'),
        cycleType: linkDoc.cycleType,
        checklistLClassId: linkDoc.row.checklistLClassId,
        apprId,
        lastApprId: linkDoc.lastApprId,
      });
      message.success('상신완료 되었습니다');
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 연결하지 못했습니다'));
    }
  };

  // [E3] viewCell (ImageCell).callbackOnCreate (L187) / 문서보기 아이콘 viewCell L164: 결재문서가 없으면 안내, 있으면 Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval
  const viewAppr = (row: IcsChecklistRelateAppr) => {
    if (row.apprId == null) { message.info('상신문서가 존재하지않습니다'); return; }
    setViewApprId(row.apprId);
  };

  // buildGrid() L152-209 — 열 순서·폭·제목은 원본 그대로
  const columnDefs = [
    gb.text('checkLClassName', 220, '대분류'),
    gb.long('totalCount', 80, '전체건수'),
    gb.long('confirmCount', 80, '확인건수'),
    // rdViewCell L153 → viewRd(): insertRdChecklistDetail → RD 뷰어 (다음 단계)
    iconCell<IcsChecklistRelateAppr>('view', 'rdViewCell', 60, '미리보기', () => { message.info('미리보기 리포트(RD)는 다음 단계에서 연결합니다.'); }),
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
                onLoad={codes => setPeriodName(codes.find(c => c.code === view.current.period)?.name ?? '')}
                onChange={(code, name) => { if (code) { setPeriod(code); setPeriodName(name ?? ''); } }}
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
      {/* linkCheck() 문서분류 확인 창 */}
      <Dcr01_Lookup_Class
        open={classPick != null}
        classTreeId={classPick?.defaultClassTreeId ?? null}
        onResult={r => { if (classPick) createRd(classPick.req, r.classTreeId); }}
        onClose={() => setClassPick(null)}
      />
      {/* insertLinkApproval() L343-359: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A27", selectModel, isAdmin, callback → updateApprId) / viewCell → retrieveApproval */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc && linkDoc.classTreeId != null ? {
          classTreeId: linkDoc.classTreeId,
          linkCode: LINK_CODE,
          refId: linkDoc.row.checklistLClassId,
          args: {
            stdDate: getDate(linkDoc.year, linkDoc.period, linkDoc.cycleType)?.format('YYYY-MM-DD'),
            cycleType: linkDoc.cycleType,
            yyyy: linkDoc.year,
            mm: linkDoc.periodName,
          },
        } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </LookupModal>
  );
};
