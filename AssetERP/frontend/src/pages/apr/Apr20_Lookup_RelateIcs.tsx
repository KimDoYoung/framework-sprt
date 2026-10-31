/**
 * 연관법규 설정 창 (V10) — 연관법규 목록 한 줄의 기준일(결재완료일/발생일)과 마감일을 정한다.
 * AS-IS: myApp/client/vi/apr/Apr20_Lookup_RelateIcs.java (444줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L190-205: 650×755 모달 "설정", 법규명 · 상세내용(150) · 관련조문 · 제출처 · 기한 · 서식파일 · 기준일(◉결재완료일 ◉발생일 + 날짜) · 마감일([계산하기] + 날짜), 푸터 [저장][닫기]
 * 12-화면우선원칙: 읽기 전용 칸은 높이를 줄여 스크롤바가 생기지 않게 한다(AS-IS 상세내용 150·관련조문 70 고정).
 * V13: view() L146-188 "상세보기"(읽기 전용, [닫기]만)와 연관내규 설정 창 Apr22_Lookup_RelateIcr(같은 화면, 법규명 → 내규명·서식파일 Icr01_Page_IcrFile)를 `view`·`kind`로 함께 쓴다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprRelateIcsRow } from '@/types/apr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ics01_Page_IcsFile } from '@/components/lookup/Ics01_Page_IcsFile';
import { Icr01_Page_IcrFile } from '@/components/lookup/Icr01_Page_IcrFile';

const FMT = 'YYYY-MM-DD';
const LABEL_W = 70;

interface Props {
  /** open(relateIcsGrid, editModel, callback) — 값이 있으면 열린다 */
  row: AprRelateIcsRow | null;
  /** update() L430-435: callback.execute(relateIcsModel) — 부르는 쪽이 줄의 기준·마감을 바꾼다. 창은 안 닫힌다 */
  onSet: (patch: { standCode: string | null; standDate: string | null; closeDate: string | null; standYn: string }) => void;
  onClose: () => void;
  /** view(viewModel) — 상세보기: 읽기 전용, [닫기]만 */
  view?: boolean;
  /** 'icr'이면 연관내규 창(Apr22_Lookup_RelateIcr) */
  kind?: 'ics' | 'icr';
}

const Line: React.FC<{ label: string; children: React.ReactNode; top?: boolean }> = ({ label, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 8 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0, paddingTop: top ? 5 : 0 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Apr20_Lookup_RelateIcs: React.FC<Props> = ({ row, onSet, onClose, view = false, kind = 'ics' }) => {
  const [standCode, setStandCode] = useState<string | null>(null);
  const [standDate, setStandDate] = useState<Dayjs | null>(null);
  const [closeDate, setCloseDate] = useState<Dayjs | null>(null);
  const [standYn, setStandYn] = useState('false');
  /** closeDateCheck — [계산하기]가 낸 마감일 */
  const closeDateCheck = useRef<string | null>(null);
  const sudo = row?.cycleName === '수시';

  // open() L91-144: 수시 → 발생일(20)로 시작, 아니면 기준일·계산하기는 막힌다. 줄의 기준코드가 있으면 그 값
  useEffect(() => {
    if (!row) return;
    closeDateCheck.current = null;
    setStandYn(row.standYn ?? 'false');
    setStandDate(row.standDate ? dayjs(row.standDate) : null);
    setCloseDate(row.closeDate ? dayjs(row.closeDate) : null);
    setStandCode(row.standCode === '10' || row.standCode === '20' ? row.standCode : (sudo ? '20' : row.standCode));
  }, [row, sudo]);

  const radioOn = sudo && !view;                       // 수시가 아니면 radio01·radio02·standDate·calculateButton이 모두 막힌다 (L116-121)
  const dateOn = sudo && standCode === '20' && !view;  // [E1] 발생일이면 standDate·계산하기·closeDate를 켠다

  // [E1] toggleType.ValueChange (L287) → 인라인 L287-308
  const onToggle = (code: string) => {
    setStandCode(code);
    if (code === '10') setCloseDate(null);
  };

  // [E4] calculateButton[계산하기].Select [radio01.getValue()] (L322) → closeDateCheck() L352-377: apr.Apr20_RelateIcs.getCloseDate(deadlineId, standDate)
  const calculate = async () => {
    if (standCode === '10') {
      setCloseDate(null);
      Modal.info({ title: '확인', content: '결재완료일은 계산할 수 없습니다', okText: '확인' });
      return;
    }
    if (!standDate) {
      Modal.info({ title: '확인', content: '발생일자를 입력해주세요', okText: '확인' });
      return;
    }
    if (!row || row.deadlineId == null) return;
    try {
      const d = await aprRelateEditApi.getCloseDate(row.deadlineId, standDate.format(FMT));
      if (d) {
        setCloseDate(dayjs(d));
        closeDateCheck.current = d;
        setStandYn('true');
      }
    } catch (err) {
      message.error(errorMessage(err, '계산 실패'));
    }
  };

  const info = (content: string) => Modal.info({ title: '확인', content, okText: '확인' });

  // update() L430-435
  const update = () => {
    onSet({ standCode, standDate: standDate ? standDate.format(FMT) : null, closeDate: closeDate ? closeDate.format(FMT) : null, standYn });
    info('설정 내용이 저장되었습니다');
  };

  // [E5] updateButton[저장].Select (L338) → updateCheck() L379-428 → [E7] msgBox "마감일을 수기로 입력하였습니다. 그대로 진행하시겠습니까?" [YES] (L403) → update()
  const updateCheck = () => {
    if (!row) return;
    if (sudo) {
      if (standCode == null) return info('기준일을  선택해주세요');
      if (standCode === '10') return update();
      if (standCode === '20') {
        if (!standDate) return info('발생일은 날짜를 지정해주세요');
        if (!closeDate) return info('마감일을 계산해주세요');
        if (closeDate.format(FMT) === closeDateCheck.current || standYn === 'true') return update();
        Modal.confirm({ title: '확인', content: '마감일을 수기로 입력하였습니다. 그대로 진행하시겠습니까?', okText: '예', cancelText: '아니오', width: 480, onOk: () => { setStandYn('false'); update(); } });
      }
    } else {
      if (!closeDate) return info('마감일을 선택해주세요');
      update();
    }
  };

  return (
    <LookupModal
      open={row != null}
      title={view ? '상세보기' : '설정'}
      width={700}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {!view && <Button type="save" onClick={updateCheck}>저장</Button>}
          {/* [E6] closeButton[닫기].Select (L344) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      {row && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Line label={kind === 'icr' ? '내규명' : '법규명'}><Input.TextArea readOnly autoSize={{ minRows: 1, maxRows: 2 }} value={row.classTreeFullName ?? ''} style={{ resize: 'none' }} /></Line>
          <Line label="상세내용" top><Input.TextArea readOnly rows={5} value={row.content ?? ''} style={{ resize: 'none' }} /></Line>
          <Line label="관련조문" top><Input.TextArea readOnly rows={2} value={row.relatedLaw ?? ''} style={{ resize: 'none' }} /></Line>
          <Line label="제출처"><Input readOnly value={row.submitTo ?? ''} /></Line>
          <Line label="기한"><Input readOnly value={row.deadlineFullName ?? ''} /></Line>
          <Line label="서식파일" top><div style={{ height: 120 }}>{kind === 'icr' ? <Icr01_Page_IcrFile classTreeId={row.classTreeId} /> : <Ics01_Page_IcsFile classTreeId={row.classTreeId} />}</div></Line>
          <Line label="기준일">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio.Group value={standCode} disabled={!radioOn} onChange={e => onToggle(e.target.value)}>
                <Radio value="10">결재완료일</Radio>
                <Radio value="20">발생일</Radio>
              </Radio.Group>
              <DatePicker style={{ width: 130 }} disabled={!dateOn} value={standDate} onChange={d => setStandDate(d)} />
            </div>
          </Line>
          <Line label="마감일">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="calculate" disabled={!dateOn} onClick={calculate}>계산하기</Button>
              {/* [E2]·[E3] closeDate.Change·TriggerClick (L310·L316) → standYn = "false" */}
              <DatePicker style={{ width: 130 }} disabled={view || (sudo && !dateOn)} value={closeDate} onChange={d => { setCloseDate(d); setStandYn('false'); }} />
            </div>
          </Line>
        </div>
      )}
    </LookupModal>
  );
};
