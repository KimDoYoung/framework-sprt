/**
 * 공용차량 예약 시간막대 (T13) — 예약 팝업 아래에 붙는다
 * AS-IS: myApp/client/vi/car/Car03_TimelineChart.java (71줄, Google Charts Timeline) — retrieve(list) L40-70
 * 행 이름 = 차량명(Title), 막대 글 = 행선지(Name), 시작·끝 = startTime·closeTime. 배경 #F7F8FC, 행 이름 보임, 행 이름별 색(setColorByRowLabel)
 * Google Charts 라이브러리는 쓰지 않고 같은 모양을 직접 그린다(새 의존성 없음 — 작업기록 참고)
 */
import React, { useMemo } from 'react';
import { CarBookingTimeline } from '@/types/car';

/** 'yyyy-MM-dd HH:mm:ss' → 그날 0시부터의 분 */
const minutesOf = (t: string): number => {
  const m = /(\d{2}):(\d{2})/.exec(t.slice(11));
  return m ? +m[1] * 60 + +m[2] : 0;
};
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

const COLORS = ['#364358', '#3b7dd8', '#2f9e8f', '#d98324', '#8a5cc2', '#c2455e', '#6b8e23', '#7a7a7a'];
const LABEL_WIDTH = 170;

interface Props {
  rows: CarBookingTimeline[];
}

export const Car03_TimelineChart: React.FC<Props> = ({ rows }) => {
  const { lines, from, to } = useMemo(() => {
    const names: string[] = [];
    const map = new Map<string, CarBookingTimeline[]>();
    for (const r of rows) {
      if (!map.has(r.infoNm)) { map.set(r.infoNm, []); names.push(r.infoNm); }
      map.get(r.infoNm)!.push(r);
    }
    const starts = rows.map(r => minutesOf(r.startTime));
    const closes = rows.map(r => minutesOf(r.closeTime));
    const lo = starts.length ? Math.floor(Math.min(...starts) / 60) * 60 : 8 * 60;
    const hi = closes.length ? Math.ceil(Math.max(...closes) / 60) * 60 : 19 * 60;
    return { lines: names.map(n => ({ name: n, items: map.get(n)! })), from: lo, to: Math.max(hi, lo + 60) };
  }, [rows]);

  const span = to - from;
  const hours: number[] = [];
  for (let h = from; h <= to; h += 60) hours.push(h);
  const pct = (min: number) => `${((min - from) / span) * 100}%`;

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', background: '#F7F8FC', border: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {lines.map((line, i) => (
          <div key={line.name} style={{ flex: '1 0 32px', display: 'flex', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ width: LABEL_WIDTH, flexShrink: 0, padding: '0 8px', display: 'flex', alignItems: 'center', color: '#000', fontSize: 12, borderRight: '1px solid #e8e8e8', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {line.name}
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              {hours.map(h => <div key={h} style={{ position: 'absolute', top: 0, bottom: 0, left: pct(h), borderLeft: '1px solid #ececf2' }} />)}
              {line.items.filter(r => minutesOf(r.closeTime) > minutesOf(r.startTime)).map((r, k) => {
                const s = minutesOf(r.startTime);
                const e = minutesOf(r.closeTime);
                return (
                  <div key={`${r.bookingId}-${k}`} title={`${r.infoNm} ${r.destination.trim()} ${hhmm(s)} ~ ${hhmm(e)}`}
                    style={{ position: 'absolute', top: 4, bottom: 4, left: pct(s), width: `${((e - s) / span) * 100}%`, background: COLORS[i % COLORS.length], color: '#fff', fontSize: 12, padding: '0 4px', display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', borderRadius: 2 }}>
                    {r.destination.trim()}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* 시간 축 */}
      <div style={{ display: 'flex', height: 22, flexShrink: 0 }}>
        <div style={{ width: LABEL_WIDTH, flexShrink: 0 }} />
        <div style={{ position: 'relative', flex: 1 }}>
          {hours.map(h => (
            <span key={h} style={{ position: 'absolute', left: pct(h), transform: 'translateX(-50%)', fontSize: 11, color: '#555', lineHeight: '22px' }}>{String(h / 60).padStart(2, '0')}:00</span>
          ))}
        </div>
      </div>
    </div>
  );
};
