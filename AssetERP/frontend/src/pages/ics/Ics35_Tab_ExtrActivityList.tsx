/**
 * [1432] 준법감시 > 12. 대외활동 > 대외활동 신청내역 (M02)
 * AS-IS: myApp/client/vi/ics/Ics35_Tab_ExtrActivityList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 툴바(조회기간 ~ · 「조회기간 없이 결과보고 누락건만 조회」 체크 · 조회) + 그리드(행번호, 선택 없음). 그리드 L105-134: 신청일자 100 · 신청자 100 · 사번 80 · 부서명 150 · 활동처 200 · 활동대상 200 · 활동기간 280 ·
 *   [활동신청] 결재상태 100 · 문서보기 80 / [결과보고] 결재상태 100 · 문서보기 80. 짝: Ics35_Tab_ExtrActivity(M01)
 * 1단계(F·I와 같은 방침): 전자결재 편집창 Apr01_Edit_ApprDoc을 여는 [문서보기]는 안내만 띄운다 — 다음 단계
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsExtrActivity } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcsExtrActivity>();

export const Ics35_Tab_ExtrActivityList: React.FC = () => {
  const [rows, setRows] = useState<IcsExtrActivity[]>([]);
  const [loading, setLoading] = useState(false);
  // settings() L78-103: 조회기간 = 올해 1월 1일 ~ 오늘, 체크박스 꺼짐
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [unknown, setUnknown] = useState(false);

  // retrieve() L136-150: 서비스 ics.Ics35_ExtrActivity.selectByCompanyId(companyId, startDate, closeDate, unknown)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await icsApi.searchExtrActivitiesForCompany(startDate.format('YYYY-MM-DD'), closeDate.format('YYYY-MM-DD'), unknown));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, unknown]);

  // [E0] 화면 열림 (생성자 L50-76) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // viewAppr(apprId) L152-174: ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(model, false), 없으면 "해당문서의 열람권한이 없습니다"
  const viewAppr = (apprId: number | null) => {
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 다음 단계
    void apprId;
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  // buildGrid() L105-134
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '신청일자'),  // L121 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.textCenter('personNm', 100, '신청자'),  // L122
    gb.textCenter('personNo', 80, '사번'),  // L123
    gb.text('orgNm', 150, '부서명'),  // L124
    gb.text('activityCorp', 200, '활동처'),  // L125
    gb.text('activityTgtNm2', 200, '활동대상'),  // L126
    gb.text('activityPeriod', 280, '활동기간'),  // L127
    gb.group('활동신청', [  // HeaderGroupMap(0, 8, "활동신청", 1, 2)
      gb.textStatus('apprStatusNm', 100, '결재상태'),  // L128
      iconCell<IcsExtrActivity>('view', 'actionCellApprView', 80, '문서보기', row => viewAppr(row.apprId)),  // L129 actionCell01
    ]),
    gb.group('결과보고', [  // HeaderGroupMap(0, 10, "결과보고", 1, 2)
      gb.textStatus('resultApprStatusNm', 100, '결재상태'),  // L130
      iconCell<IcsExtrActivity>('view', 'actionCellResultView', 80, '문서보기', row => viewAppr(row.resultApprId)),  // L131 actionCell02
    ]),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] retrieveButton[조회].Select (L97) → retrieve() */}
      <div style={{ overflowX: 'auto' }}>
        <SearchBar onSearch={retrieve} loading={loading} style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <SearchBar.Field label="조회기간">
            <DatePicker allowClear={false} style={{ width: 130 }} disabled={unknown} value={startDate} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker allowClear={false} style={{ width: 130 }} disabled={unknown} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          {/* [E1] checkBox[조회기간 없이 결과보고 누락건만 조회].ValueChange (L85) → 켜면 조회기간 칸을 끈다, 끄면 켠다 */}
          <Checkbox checked={unknown} onChange={e => setUnknown(e.target.checked)}>조회기간 없이 결과보고 누락건만 조회</Checkbox>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<IcsExtrActivity>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.extrActivityId)}
        />
      </div>
    </div>
  );
};
