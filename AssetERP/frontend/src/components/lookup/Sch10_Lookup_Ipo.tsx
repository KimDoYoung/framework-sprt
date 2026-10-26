/**
 * 공모주 정보 창 — 기간별 업무일정 조회(O02)에서 분류가 "공모주"(classId 0)인 행의 [상세보기]로 연다
 * AS-IS: myApp/client/vi/sch/Sch10_Lookup_Ipo.java (157줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init L58-74·getEditor L101-148: 모달 "공모주 정보" 520×400, 전부 읽기 전용(settings L76-99) — 종목 · 시장구분 · 수요예측 시작/종료일 · 청약 시작/종료일 ·
 *   납입(환불)일/상장(예정)일 · 공모가(#,###) · 주간사(note, 높이 70), 아래 가운데 [닫기]. 색인이 [닫기]를 "도달 불가"로 표시하지만 init에서 buttonBar에 붙는다
 */
import React from 'react';
import { Input, InputNumber, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';
import { Sch10Ipo } from '@/types/sch';

interface Props {
  /** 있으면 열린다 (AS-IS new Sch10_Lookup_Ipo(model, callback) — 생성자가 곧바로 연다) */
  ipo: Sch10Ipo | null;
  onClose: () => void;
}

const ROW = { display: 'flex', margin: '15px 15px 0 5px' } as const;
const CELL = { display: 'flex', alignItems: 'center', width: 230, flex: '0 0 auto' } as const;
const LABEL = { width: 125, flex: '0 0 auto', textAlign: 'right', paddingRight: 8 } as const;

const Field: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div style={CELL}><div style={LABEL}>{label}</div><Input readOnly value={value ?? ''} /></div>
);

export const Sch10_Lookup_Ipo: React.FC<Props> = ({ ipo, onClose }) => (
  <LookupModal
    open={ipo != null}
    title={<b>공모주 정보</b>}
    width={520}
    maskClosable={false}
    onCancel={onClose}
    destroyOnClose
    footer={
      <div style={{ textAlign: 'center' }}>
        <Space>
          {/* [E1] closeButton[닫기].Select (L90) → callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      </div>
    }
  >
    {/* [E0] 열림 (생성자 L51-56) → init() */}
    <div style={ROW}><div style={{ ...CELL, width: 460 }}><div style={LABEL}>종목</div><Input readOnly value={ipo?.itemName ?? ''} /></div></div>
    <div style={ROW}><Field label="시장구분" value={ipo?.marketName} /></div>
    <div style={ROW}><Field label="수요예측 시작일" value={ipo?.demandStartDate} /><Field label="수요예측 종료일" value={ipo?.demandCloseDate} /></div>
    <div style={ROW}><Field label="청약 시작일" value={ipo?.subscriptionStartDate} /><Field label="청약 종료일" value={ipo?.subscriptionCloseDate} /></div>
    <div style={ROW}><Field label="납입(환불)일" value={ipo?.payDate} /><Field label="상장(예정)일" value={ipo?.listDate} /></div>
    <div style={ROW}>
      <div style={CELL}>
        <div style={LABEL}>공모가</div>
        <InputNumber readOnly controls={false} style={{ width: '100%' }} value={ipo?.price ?? null} formatter={v => (v == null ? '' : Number(v).toLocaleString('en-US'))} />
      </div>
    </div>
    <div style={ROW}>
      <div style={{ ...CELL, width: 460, alignItems: 'flex-start' }}>
        <div style={{ ...LABEL, paddingTop: 5 }}>주간사</div>
        <Input.TextArea readOnly value={ipo?.note ?? ''} style={{ height: 70, resize: 'none' }} />
      </div>
    </div>
  </LookupModal>
);
