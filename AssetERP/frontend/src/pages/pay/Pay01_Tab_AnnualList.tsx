/**
 * 연봉계약현황 (S14) — 경영관리 > 03. 연봉관리 > 연봉계약현황 #1082
 * AS-IS: myApp/client/vi/pay/Pay01_Tab_AnnualList.java (388줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor(): 툴바 45(사원명 · 기간 라디오(최근등록내역/년도별 [년도]/전체) · 퇴사자 포함 · [조회][출력/다운로드]) + 연봉계약 보기 그리드(2단 헤더, 앞 3열 고정).
 * 조회는 결재완료(apprCheckYn)만. 1단계: 상신상태 아이콘의 결재문서 보기(Apr01_Edit_ApprDoc, 다른 도메인 apr)는 다음 단계.
 * 출력 창 Pay01_Lookup_Rd_AnnualList(1300×880 "연봉계약현황" + [닫기])는 공통 RdViewer가 맡는다(AS-IS도 사원을 안 골랐을 때는 RDViewer.viewer를 쓴다).
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { empApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayAnnual } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { RdViewer } from '@/components/lookup/RdViewer';
import dayjs from 'dayjs';

const gb = gbFor<PayAnnual>();

export const Pay01_Tab_AnnualList: React.FC = () => {
  const today = dayjs().format('YYYY-MM-DD');
  // settings(): yearText = 올해(비활성), radio01 선택 = 최근등록내역(radioOption 1), 퇴사자 포함 = false
  const [radioOption, setRadioOption] = useState(1);
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  const [retireYn, setRetireYn] = useState(false);
  const [personName, setPersonName] = useState('');
  // 조회 함수가 사원을 고른 직후의 값을 바로 쓰도록 ref에도 둔다
  const personIdRef = useRef<number | null>(null);
  // ValueChange(글자가 바뀐 채로 칸을 벗어남·Enter)를 가르는 마지막 확정 글자
  const committedRef = useRef('');
  const [personLookup, setPersonLookup] = useState<{ searchText: string } | null>(null);
  const [rows, setRows] = useState<PayAnnual[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [rdLoading, setRdLoading] = useState(false);

  // retrieve() L355-374: 사원을 안 골랐으면 pay.Pay01_Annual.selectByAll, 골랐으면 selectByPersonId (companyId·radioOption·yearStr·retireYn·apprCheckYn "true")
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await payApi.searchAnnuals({ personId: personIdRef.current, radioOption, yearStr: yearText, retireYn, apprCheckYn: true }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [radioOption, yearText, retireYn]);

  // [E0] 화면 열림 (생성자 L78-92) → settings(). 조회는 열 때 하지 않는다

  // [E2] personName.TriggerClick (L149) → openLookupPerson(null)
  // [E3] personName.ValueChange (L155): 비우면 사원 해제 후 retrieve(), 아니면 재직(100) '%글자%'로 찾아 한 명이면 바로 선택·retrieve(), 아니면 openLookupPerson(글자)
  const onPersonCommit = async (text: string) => {
    if (text === committedRef.current) return;
    committedRef.current = text;
    if (text === '') {
      personIdRef.current = null;
      await retrieve();
      return;
    }
    try {
      const list = await empApi.searchTransInfos(today, text, '100');
      if (list.length === 1) {
        committedRef.current = list[0].korNm ?? '';
        setPersonName(list[0].korNm ?? '');
        personIdRef.current = list[0].personId;
        await retrieve();
      } else {
        setPersonLookup({ searchText: text });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // openLookupPerson(): 고르면 이름·ID를 채우고, [전체](null)이면 비운다 (조회는 하지 않는다)
  const onPersonPicked = (row: TransInfo | null) => {
    setPersonLookup(null);
    committedRef.current = row?.korNm ?? '';
    setPersonName(row?.korNm ?? '');
    personIdRef.current = row?.personId ?? null;
  };

  // [E5] downLoadButton[출력/다운로드].Select (L193): 사원을 안 골랐으면 insertRdAnnualListAll → RDViewer.viewer(mrd Pay01_Rd_AnnualList),
  //   골랐으면 insertRdAnnualList → Pay01_Lookup_Rd_AnnualList.open(rdGroupId). 둘 다 결재완료만, 같은 보고서
  const download = async () => {
    setRdLoading(true);
    try {
      const rdGroupId = await payApi.rdPrintAnnuals({ personId: personIdRef.current, radioOption, yearStr: yearText, retireYn });
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay01_Rd_AnnualList', options: '/rhtmlimportopt [2]', rv: { rdGroupId } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setRdLoading(false);
    }
  };

  // buildGrid(): SingleGrid(Pay01_AnnualModel), 2단 헤더 2개(기본정보 8열 · 월급여 구성 7열), 직급·사번·성명 고정
  const columnDefs = useMemo(() => [
    gb.group('기본정보', [
      gb.textCenter('posName', 80, '직급', { pinned: 'left' }),
      gb.textCenter('personNo', 50, '사번', { pinned: 'left' }),
      gb.textCenter('personName', 80, '성명', { pinned: 'left' }),
      gb.date('startDate', 90, '적용시작일'),
      gb.date('closeDate', 90, '적용종료일'),
      gb.textCenter('startTime', 80, '시업시간'),
      gb.textCenter('closeTime', 80, '종업시간'),
      gb.longCenter('monthOtHours', 80, '월연장<br>근로시간'),
    ]),
    gb.long('annualPay', 100, '기본연봉'),
    gb.long('retirePay', 100, '퇴직금'),
    gb.long('yearPay', 100, '총연봉'),
    gb.text('etcAgreement', 100, '기타약정사항'),
    gb.group('월급여 구성', [
      gb.long('basicPay', 100, '기본급여'),
      gb.long('mealPay', 100, '중식대'),
      gb.long('carMt', 100, '차량유지비'),
      gb.long('childcareAllowance', 100, '양육수당'),
      gb.long('overPay', 100, '연장근로'),
      gb.long('etc01Pay', 100, '기타급여1'),
      gb.long('etc02Pay', 100, '기타급여2'),
    ]),
    gb.long('monthPay', 100, '합계'),
    gb.text('apprStatusName', 100, '상신상태'),
    // [E6] actionCell (ImageCell).callbackOnCreate (L290) → 인라인 L290-295: 상신문서가 없으면 "상신문서가 없습니다", 있으면 Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
    iconCell<PayAnnual>('view', 'actionCell', 60, '', row => {
      if (row.apprId == null) { message.warning('상신문서가 없습니다'); return; }
      message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
    }),
  ], []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L187) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<Button type="download" onClick={download} loading={rdLoading}>출력/다운로드</Button>}
        >
          <SearchBar.Field label="사원명">
            <Input
              style={{ width: 100 }}
              placeholder="전체"
              value={personName}
              allowClear
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setPersonLookup({ searchText: '' })} />}
              onChange={e => { setPersonName(e.target.value); if (e.target.value === '') void onPersonCommit(''); }}
              onPressEnter={e => void onPersonCommit((e.target as HTMLInputElement).value.trim())}
              onBlur={e => void onPersonCommit(e.target.value.trim())}
            />
          </SearchBar.Field>
          {/* [E1] toggleGroup.ValueChange (L109) → radioOption 1·2·3, 년도별일 때만 년도 입력 */}
          <Radio.Group value={radioOption} onChange={e => setRadioOption(e.target.value)}>
            <Radio value={1}>최근등록내역</Radio>
            <Radio value={2}>년도별</Radio>
            <Input style={{ width: 70 }} placeholder="YYYY" disabled={radioOption !== 2} value={yearText} onChange={e => setYearText(e.target.value)} />
            <Radio value={3} style={{ marginLeft: 8 }}>전체</Radio>
          </Radio.Group>
          <Checkbox checked={retireYn} onChange={e => setRetireYn(e.target.checked)}>퇴사자 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PayAnnual> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.annualId)} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personLookup != null} separateAddTitle searchText={personLookup?.searchText ?? ''} transDate={today} onResult={onPersonPicked} onClose={() => setPersonLookup(null)} />
      {/* Pay01_Lookup_Rd_AnnualList(1300×880 "연봉계약현황" + [닫기]) — RdViewer가 같은 모양의 창.
          [E0] 화면 열림 (생성자 L31-51, open(rdGroupId) L53-80) → 보고서 iframe · [E1] closeButton[닫기].Select (L40) → hide() */}
      <RdViewer url={rdUrl} title="연봉계약현황" onClose={() => setRdUrl(null)} />
    </div>
  );
};
