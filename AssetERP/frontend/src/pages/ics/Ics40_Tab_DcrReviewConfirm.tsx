/**
 * [1499] 준법감시 > 90. 기타 > 심사필 확인대장 (M06)
 * AS-IS: myApp/client/vi/ics/Ics40_Tab_DcrReviewConfirm.java (241줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 툴바(조회기간 ~ · 대장분류 콤보 · 검색 · [조회]) + 그리드(행번호, 체크박스 다중). M05(Ics40_Tab_DcrPreConfirm)와 같은 열, 읽기 전용 — 의견 아이콘은 Ics40_Edit_Msg.show(읽기 전용)
 * 1단계(M05와 같은 방침): [문서확인]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 안내만(다음 단계). [알림설정] noticeButton은 원본도 툴바에 안 붙인 도달 불가 버튼이라 만들지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsDcrPreconfirm, IcsDcrTypeOption } from '@/types/ics';
import { MultiGrid } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { ics40Columns } from './ics40Columns';
import { Ics40_Edit_Msg, Ics40_Edit_MsgTarget } from './Ics40_Edit_Msg';

const ALL = '%';

export const Ics40_Tab_DcrReviewConfirm: React.FC = () => {
  const [rows, setRows] = useState<IcsDcrPreconfirm[]>([]);
  const [skipYn, setSkipYn] = useState<boolean | null>(null);
  // settings() L93-140: 조회기간 = 이번 달 1일 ~ 오늘, 대장분류 "전체"(%)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [dcrTypeCode, setDcrTypeCode] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [typeOptions, setTypeOptions] = useState<IcsDcrTypeOption[]>([]);
  const [msgTarget, setMsgTarget] = useState<Ics40_Edit_MsgTarget | null>(null);

  // retrieve() L194-211: 서비스 ics.Ics40_DcrPreconfirm.selectByReviewConfirm(companyId, empId, orgId, startDate, closeDate, dcrTypeCode, "%"+searchText+"%")
  const retrieve = useCallback(async (code: string = dcrTypeCode) => {
    try {
      setRows(await icsApi.searchDcrPreconfirms(true, startDate.format('YYYY-MM-DD'), closeDate.format('YYYY-MM-DD'), code, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate, dcrTypeCode, searchText]);

  // [E0] 화면 열림 (생성자 L62-91) → settings(): 대장분류 콤보를 읽은 뒤 "전체"로 두고 retrieve()
  useEffect(() => {
    (async () => {
      try {
        const [skip, options] = await Promise.all([icsApi.getDcrPreconfirmSkipYn(), icsApi.getDcrTypeOptions()]);
        setSkipYn(skip);
        setTypeOptions(options);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        setSkipYn(false);
      }
      void retrieve(ALL);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4 생략] noticeButton[알림설정].Select (L133) → Emp93_Lookup_SmsNoticeTarget.open("B01") — 원본도 툴바에 안 붙인 도달 불가 버튼
  // viewAppr() L213-236: ApprCallbackResult(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(model, false), 없으면 "해당문서의 열람권한이 없습니다"
  const viewAppr = (row: IcsDcrPreconfirm) => {
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 다음 단계
    void row;
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  const columnDefs = useMemo(() => ics40Columns({
    skipYn: skipYn === true,
    onViewAppr: viewAppr,
    msgIcon: 'view',
    // buildGrid actionCell02 L150-156: Ics40_Edit_Msg.show(선택 행) — 읽기 전용
    onMsg: row => setMsgTarget({ row, mode: 'view' }),
  }), [skipYn]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ overflowX: 'auto' }}>
        {/* [E3] retrieveButton[조회].Select (L127) → retrieve() / [E2] searchText.KeyPress [Enter] (L118) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <SearchBar.Field label="조회기간">
            <DatePicker allowClear={false} style={{ width: 130 }} value={startDate} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker allowClear={false} style={{ width: 130 }} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="대장분류">
            {/* [E1] dcrTypeComboBox[sys.Sys00_Common.selectIcs41DcrType].Collapse (L109) → retrieve() — 고르면 바로 조회 */}
            <Select
              style={{ width: 120 }}
              value={dcrTypeCode}
              options={[{ value: ALL, label: '전체' }, ...typeOptions.map(o => ({ value: o.code, label: o.name }))]}
              onChange={v => { setDcrTypeCode(v); void retrieve(v); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="심사필번호/제공처/내용/신청자/대장분류" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {skipYn != null && (
          <MultiGrid<IcsDcrPreconfirm>
            key={String(skipYn)}
            selectionColumnDef={{ pinned: 'left' }}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.dcrPreconfirmId)}
          />
        )}
      </div>
      <Ics40_Edit_Msg target={msgTarget} onClose={() => setMsgTarget(null)} />
    </div>
  );
};
