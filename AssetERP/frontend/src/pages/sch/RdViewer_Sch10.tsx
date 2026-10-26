/**
 * 공모주 달력 RD 미리보기 창 (Q04) — 공모주 일정조회(Sch10_Tab_Ipo)의 [공모주 달력]에서 연다
 * AS-IS: myApp/client/vi/RDViewer.java `openSch10(param, rvParam)` L109-170 + `buttonSetting("Sch10")` L257-299 + `setRd` L436-449 (다른 화면의 RD 창과 같은 클래스의 Sch10 모드)
 * 위 툴바 50(기준년월 ◀ [yyyy.MM 70] ▶ · ☐ 관심종목만 보기 · [조회]) + RD 리포트 `Sch10_Rd_Ipo`(rv: YYYYMM, 조회·이전·다음부터 interestYn), 아래 가운데 [닫기]
 * 처음에는 오늘이 속한 달, interestYn 없이 연다(rvParam에 companyId·personId·YYYYMM만). [조회]·◀·▶는 rv에 YYYYMM·interestYn을 넣어 다시 연다.
 * yyyyMM 칸에서 Enter는 원본이 갱신 없이 마지막 rvParam 그대로 다시 연다(L117-121)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import dayjs from 'dayjs';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MRD = 'Sch10_Rd_Ipo';

export const RdViewer_Sch10: React.FC<Props> = ({ open, onClose }) => {
  const [yyyyMM, setYyyyMM] = useState(dayjs().format('YYYY.MM'));
  const [interestYn, setInterestYn] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  /** rvMap — setRd가 마지막으로 쓴 rv 값 */
  const rvRef = useRef<Record<string, string>>({});

  // setRd(map, rvMap, "Sch10") L436-449
  const setRd = useCallback(async (rv: Record<string, string>) => {
    rvRef.current = rv;
    try {
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: MRD, options: '/rhtmlimportopt [2]', rv });
      setUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, 'RD 주소를 만들지 못했습니다'));
    }
  }, []);

  // openSch10 L109-: 오늘이 속한 달로 열고 처음 한 번 리포트를 그린다 (rvParam: YYYYMM)
  useEffect(() => {
    if (!open) return;
    const ym = dayjs().format('YYYY.MM');
    setYyyyMM(ym);
    setInterestYn(false);
    void setRd({ YYYYMM: ym.replace('.', '') });
  }, [open, setRd]);

  // getStdDate() L451-455: 칸의 yyyy.MM의 1일
  const stdDate = () => dayjs(`${yyyyMM.replace(/-/g, '.').replace('.', '-')}-01`);

  const move = (months: number) => {
    // beforeDate / nextDate.MouseDown (L128-148): 한 달 앞뒤로 바꿔 YYYYMM·interestYn과 함께 다시 연다
    const d = stdDate().add(months, 'month');
    setYyyyMM(d.format('YYYY.MM'));
    return setRd({ YYYYMM: d.format('YYYYMM'), interestYn: String(interestYn) });
  };

  return (
    <LookupModal
      open={open}
      title=""
      width="90vw"
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 5, border: '1px solid #d9d9d9', marginBottom: 8 }}>
        <span>기준년월 </span>
        <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }} onMouseDown={() => void move(-1)}>◀</a>
        {/* yyyyMM.KeyPress [Enter] (L117-121) → setRd(map, rvMap, "Sch10") — 칸 값은 반영하지 않는다(원본 그대로) */}
        <Input style={{ width: 70 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') void setRd(rvRef.current); }} />
        <a style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }} onMouseDown={() => void move(1)}>▶</a>
        <Checkbox checked={interestYn} onChange={e => setInterestYn(e.target.checked)}>관심종목만 보기</Checkbox>
        {/* retrieveButton[조회].Select (L150-158) → rv에 YYYYMM·interestYn을 넣어 setRd */}
        <Button type="search" onClick={() => setRd({ YYYYMM: stdDate().format('YYYYMM'), interestYn: String(interestYn) })}>조회</Button>
      </div>
      {url && <iframe title="RD" src={url} style={{ width: '100%', height: '70vh', border: '1px solid #d9d9d9' }} />}
    </LookupModal>
  );
};
