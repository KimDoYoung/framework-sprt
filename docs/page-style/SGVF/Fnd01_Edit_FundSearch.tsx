/**
 * 펀드 조회 아래 읽기 전용 폼 (P07) — Fnd01_Tab_FundSearch South(320)에 붙는다
 * AS-IS: myApp/client/vi/fnd/Fnd01_Edit_FundSearch.java (344줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L212-325: 라벨 145, 줄 7개(여백 20·20·17·20), 칸 300(보수율 260 + "(bp)" 50), 모든 칸 읽기 전용, 설정액·순자산 `#,###`, 보수율 `#,###.######`. 버튼 없음
 * retrieve(param) L327-335 / init() L337-339: 목록에서 고른 행을 보여 주고, 고른 행이 없으면 빈 폼
 */

import React from 'react';
import { Input } from 'antd';
import { FundSearch } from '@/types/fnd';

const fmtLong = (v?: number | null) => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const fmtRate = (v?: number | null) => {
  if (v == null) return '';
  const [i, d] = `${v}`.split('.');
  return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${d != null ? `.${d.slice(0, 6)}` : ''}`;
};

/** 칸 하나: 라벨(폭 145, 우측 정렬) + 읽기 전용 입력. 줄 안에서 폭 300 */
const Cell: React.FC<{ label: string; width?: number; value?: string | null; align?: 'right' }> = ({ 
  label, 
  width = 300, 
  value, 
  align 
}) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label 
      style={{ 
        width: 145, 
        flexShrink: 0, 
        textAlign: 'right', 
        paddingRight: 10 
      }}
    >
      {label}
    </label>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
      <Input readOnly value={value ?? ''} style={align ? { textAlign: align } : undefined} />
    </div>
  </div>
);

/** 보수율 칸: 칸 260 + "(bp)" 50 (rowLayout3 + LabelToolItem) */
const RateCell: React.FC<{ label: string; value?: number | null }> = ({ label, value }) => (
  <>
    <Cell label={label} width={260} value={fmtRate(value)} align="right" />
    <div style={{ width: 50, marginLeft: -3, display: 'flex', alignItems: 'center' }}>(bp)</div>
  </>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '10px 20px 10px 20px' }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 (editDriver.edit(fundModel)) — null이면 빈 폼(init()) */
  model: FundSearch | null;
}

// [E0] 화면 열림 (생성자 L192-210) → getEditor() L212-325
export const Fnd01_Edit_FundSearch: React.FC<Props> = ({ model: m }) => (
  <div style={{ height: '100%', overflow: 'auto', background: '#fff' }}>
    <Row>
      <Cell label="펀드코드" value={m?.fundCode} />
      <Cell label="펀드명/약명" width={540} value={m?.fundFullName} />
      <div style={{ width: 360, marginLeft: 5, flexShrink: 0 }}><Input readOnly value={m?.fundName ?? ''} /></div>
      <Cell label="신탁구분" value={m?.kofiaTrustName} />
    </Row>
    <Row>
      <Cell label="협회펀드코드" value={m?.kofiaFundCode} />
      <Cell label="설정일자" value={m?.startDate} />
      <Cell label="운용부서" value={m?.orgCodeName} />
      <Cell label="펀드유형" value={m?.kofiaFundTypeName} />
      <Cell label="특성분류" value={m?.kofiaCharClassName} />
    </Row>
    <Row>
      <Cell label="예탁원펀드코드" value={m?.ksdFundCode} />
      <Cell label="다음결산일" value={m?.nextCloseDate} />
      <Cell label="주운용역" value={m?.operator1} />
      <Cell label="공모/사모" value={m?.kofiaPublicName} />
      <RateCell label="운용보수율" value={m?.managementRate} />
    </Row>
    <Row>
      <Cell label="예탁원종목코드" value={m?.ksdItemCode} />
      <Cell label="다음보수인출일" value={m?.nextFeeDate} />
      <Cell label="부운용역" value={m?.operator2} />
      <Cell label="모자구분" value={m?.kofiaParentName} />
      <RateCell label="판매보수율" value={m?.salesRate} />
    </Row>
    <Row>
      <Cell label="기준통화" value={m?.cur} />
      <Cell label="만기예정일" value={m?.endExpectDate} />
      <Cell label="수탁사" value={m?.consignmentName} />
      <Cell label="클래스구분" value={m?.kofiaClassTypeName} />
      <RateCell label="수탁보수율" value={m?.consignmentRate} />
    </Row>
    <Row>
      <Cell label="설정액" value={fmtLong(m?.seoljAek)} align="right" />
      <Cell label="해지일자" value={m?.endDate} />
      <Cell label="수탁은행" value={m?.trustBankName} />
      <Cell label="단위구분" value={m?.kofiaFundUnitName} />
      <RateCell label="사무수탁보수율" value={m?.officeWorkRate} />
    </Row>
    <Row>
      <Cell label="순자산" value={fmtLong(m?.sunjasanAek)} align="right" />
      <Cell label="해지구분" value={m?.closeName} />
      <Cell label="사무수탁사" value={m?.officeWorkName} />
      <Cell label="비고" width={600} value={m?.note} />
    </Row>
  </div>
);