/**
 * 인사정보 창 (N11) — 임원별 직책배정 위쪽의 "확인하기" 링크가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm02_Lookup_HrRecord.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1350×500(원본): 툴바(미적용건만 보기 / 조회기간 : 시작 ~ 종료 · 검색 200 "구분/임원명/비고" · [조회]) + 셀 편집 그리드(적용완료 체크·비고) + [저장][닫기]
 * 닫기는 원본이 callback.execute()를 부른다 → 부르는 쪽이 "미반영된 인사정보" 문구를 다시 읽는다 (onClose)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 조회창(UX-05)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Radio, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { tdmApi } from '@/api/tdm';
import { TdmHrRecord } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<TdmHrRecord>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L184-207 */
const buildGrid = () => [
  gb.date('regDate', 100, '변경일'),  // L196
  gb.textCenter('regTypeNm', 70, '구분'),  // L197
  gb.textCenter('personNm', 80, '임원명'),  // L198
  gb.textArea('changeData', 550, '변경내용'),  // L199
  gb.boolean('applyYn', 80, '적용완료', { editable: true }),  // L201 applyYn = applyCode가 null·"0"이 아니면 true, 바꾸면 "1"/"0" (모델 getApplyYn/setApplyYn)
  gb.text('note', 150, '비고', { editor: 'text' }),  // L202
  gb.textCenter('updNm', 80, '적용자'),  // L203
  gb.textCenter('updDateStr', 150, '적용일시'),  // L204
];

/** 바뀐 적용완료 체크만 "1"/"0"으로 바꾼다 — 비고만 고친 행(예: 9 해당없음)은 코드를 그대로 보낸다 */
const applyCodeOf = (r: TdmHrRecord) => {
  const original = r.applyCode != null && r.applyCode !== '0';
  return r.applyYn === original ? r.applyCode : r.applyYn ? '1' : '0';
};

interface Props {
  open: boolean;
  /** AS-IS closeButton → callback.execute(), hide() */
  onClose: () => void;
}

export const Tdm02_Lookup_HrRecord: React.FC<Props> = ({ open, onClose }) => {
  const [period, setPeriod] = useState(false);   // radioType1 "미적용건만 보기"(applyCode "0") / radioType2 "조회기간 :"(applyCode "%")
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().add(1, 'month'));
  const [searchText, setSearchText] = useState('');
  // 조회 조건은 ref로 읽는다 — useGridCrud의 search가 바뀌면 다시 조회되지 않게
  const cond = useRef({ period, startDate, closeDate, searchText });
  cond.current = { period, startDate, closeDate, searchText };
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L209-225: tdm.Tdm02_HrRecord.selectByCompanyId(companyId, startDate, closeDate, applyCode, "%글자%", limit 100)
  const crud = useGridCrud<TdmHrRecord>({
    idField: 'hrRecordId',
    search: useCallback(() => {
      const c = cond.current;
      return tdmApi.searchHrRecords(c.period ? '%' : '0', c.startDate.format(FORMAT), c.closeDate.format(FORMAT), c.searchText, 100);
    }, []),
    // update() L227-259: tdm.Tdm02_HrRecord.updateApplyCode → "저장이 완료되었습니다." → retrieve()
    save: useCallback(async (changed: TdmHrRecord[]) => {
      await tdmApi.saveHrRecords(changed.map(r => ({ hrRecordId: r.hrRecordId, applyCode: applyCodeOf(r), note: r.note })));
      return changed;
    }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),   // 등록·삭제 버튼 없음
    reloadAfterSave: true,
  });

  // open() L74-113: 열 때 설정값으로 되돌리고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    cond.current = { period: false, startDate: dayjs(), closeDate: dayjs().add(1, 'month'), searchText: '' };
    setPeriod(false);
    setStartDate(cond.current.startDate);
    setCloseDate(cond.current.closeDate);
    setSearchText('');
    void crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] toggleGroup.ValueChange (L145) → 미적용건만 보기면 applyCode "0"·기간 비활성, 조회기간이면 "%"·기간 활성 → retrieve()
  const changePeriod = (value: boolean) => {
    cond.current = { ...cond.current, period: value };
    setPeriod(value);
    void crud.retrieve();
  };

  return (
    <LookupModal
      open={open}
      title="인사정보"
      width={1350}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[저장].Select (L169) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L175) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L163) → retrieve() */}
        <SearchBar onSearch={() => crud.retrieve()}>
          <SearchBar.Field label="">
            <Radio.Group value={period} onChange={e => changePeriod(e.target.value as boolean)}>
              <Radio value={false}>미적용건만 보기</Radio>
              <Radio value={true}>조회기간 :</Radio>
            </Radio.Group>
          </SearchBar.Field>
          <SearchBar.Field label="">
            <Space>
              <DatePicker value={startDate} format={FORMAT} allowClear={false} disabled={!period} style={{ width: 120 }}
                onChange={d => { if (d) setStartDate(d); }} />
              <span>~</span>
              <DatePicker value={closeDate} format={FORMAT} allowClear={false} disabled={!period} style={{ width: 120 }}
                onChange={d => { if (d) setCloseDate(d); }} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress (L130) → retrieve() — 원본은 아무 키나 누를 때 부르지만 SearchBar 규칙대로 Enter (작업기록 "원본과 다른 점") */}
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/임원명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmHrRecord> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
