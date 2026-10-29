/**
 * 전문인력현황(GA144) RD 보고서 탭 페이지 (T17) — Rpt10_Tab_FssOrg의 탭
 * AS-IS: myApp/client/vi/emp/Emp01_Rd_ProPersonState.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L48-91: 툴바(기준년월 70 "YYYY.MM" 기본 이번 달 · [조회] · [작성요령]) + 아래 RD 보고서 영역(mrd Emp01_Rd_ProPersonState).
 * 공통 처리는 pages/rpt/useRdStatePage.tsx
 */
import { forwardRef } from 'react';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Rpt10_Lookup_WriteGuide } from '../rpt/Rpt10_Lookup_WriteGuide';
import { RdStatePageHandle, useRdStatePage } from '../rpt/useRdStatePage';

// [E0] 화면 열림 (생성자 L48-91) → 기준년월 이번 달, 열 때 조회하지 않는다(탭을 고를 때 retrieve)
export const Emp01_Rd_ProPersonState = forwardRef<RdStatePageHandle>((_, ref) => {
  const rd = useRdStatePage(ref, { mrd: 'Emp01_Rd_ProPersonState', reportCode: 'GA144' });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] yyyyMM.KeyPress [Enter] (L55) → retrieve()  ·  [E2] retrieveButton[조회].Select (L73) → retrieve() — SearchBar가 Enter·[조회]를 맡는다 */}
      <SearchBar
        onSearch={() => void rd.retrieve()}
        loading={rd.loading}
        extra={
          /* [E3] writeWayButton[작성요령].Select (L80) → writeGuide() */
          <Button type="view" onClick={rd.writeGuide}>작성요령</Button>
        }
      >
        <SearchBar.Field label="기준년월">
          <SearchBar.Input style={{ width: 70 }} placeholder="YYYY.MM" value={rd.yyyyMM} onChange={e => rd.setYyyyMM(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        {rd.url && <iframe title="Emp01_Rd_ProPersonState" src={rd.url} style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }} />}
      </div>
      <Rpt10_Lookup_WriteGuide submit={rd.guide} onClose={rd.closeGuide} />
    </div>
  );
});
Emp01_Rd_ProPersonState.displayName = 'Emp01_Rd_ProPersonState';
