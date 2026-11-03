/**
 * 최저보수청구 구간계산정보 창 (EE21) — Biz20_Tab_FeeCharge 행의 [계산상세] 아이콘이 연다
 * AS-IS: myApp/client/vi/biz/Biz22_Lookup_FeeChargeCalc.java (160줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(selectModel) L45-73: 모달 1800×400 "최저보수청구 구간계산정보", 위 [새로고침][엑셀다운로드] / 그리드(행번호 없음) / [닫기]
 * buildGrid() L104-142: 헤더 묶음 운용보수(456EA6)·자문보수(B36D3D)·일임보수(258A65)·병행보수(404040) + getSumGrid("합계", 1, 3, 23, "4,9,14,19,20") — 합계 행은 구간일수와
 *   각 보수의 계산구간 열만 더한다(청구기간 최저보수·병행적용여부·청구기간 병행보수 제외)
 * [엑셀다운로드] L84-95: ExcelDownload?actionCode=biz22List(HSSF 시트 생성 281줄)는 엑셀 생성 묶음이라 다음 단계 — 누르면 안내만 (작업기록 "미완(Excel)")
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { bizFeeChargeApi } from '@/api/bizFee';
import { errorMessage } from '@/api/client';
import { BizFeeCharge, BizFeeChargeCalc } from '@/types/bizFee';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizFeeChargeCalc>();

const COLOR = { manage: '#456EA6', adv: '#B36D3D', discr: '#258A65', with: '#404040' } as const;
const hdr = (color: string) => ({ headerStyle: { color } });

/** 합계 행이 더하는 열 (getSumGrid 3~23에서 4·9·14·19·20 제외) */
const SUM_FIELDS = [
  'termDays',
  'manageTermMinFee', 'manageTermOccFee', 'manageTermWithFee', 'manageTermChargeFee',
  'advTermMinFee', 'advTermOccFee', 'advTermWithFee', 'advTermChargeFee',
  'discrTermMinFee', 'discrTermOccFee', 'discrTermWithFee', 'discrTermChargeFee',
  'withTermWithFee', 'withTermOccFee', 'withTermChargeFee',
] as const;

interface Props {
  /** open(selectModel) — 값이 있으면 열린다 (계약사 ID·청구일자를 쓴다) */
  row: BizFeeCharge | null;
  onClose: () => void;
}

export const Biz22_Lookup_FeeChargeCalc: React.FC<Props> = ({ row, onClose }) => {
  const [rows, setRows] = useState<BizFeeChargeCalc[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid() L104-142
  const columnDefs = useMemo(() => [
    gb.date('termStartDate', 90, '구간시작일'),  // L114
    gb.date('termCloseDate', 90, '구간종료일'),  // L115
    gb.longCenter('termDays', 65, '구간일수'),  // L116
    gb.group('운용보수', [  // L108 HeaderGroupMap(0, 4) span 5
      gb.long('manageMinFee', 90, '청구기간<br>최저보수', hdr(COLOR.manage)),
      gb.long('manageTermMinFee', 90, '계산구간<br>최저보수', hdr(COLOR.manage)),
      gb.long('manageTermOccFee', 90, '계산구간<br>발생보수', hdr(COLOR.manage)),
      gb.long('manageTermWithFee', 90, '계산구간<br>병행보수', hdr(COLOR.manage)),
      gb.long('manageTermChargeFee', 90, '청구보수', hdr(COLOR.manage)),
    ]),
    gb.group('자문보수', [  // L109
      gb.long('advMinFee', 90, '청구기간<br>최저보수', hdr(COLOR.adv)),
      gb.long('advTermMinFee', 90, '계산구간<br>최저보수', hdr(COLOR.adv)),
      gb.long('advTermOccFee', 90, '계산구간<br>발생보수', hdr(COLOR.adv)),
      gb.long('advTermWithFee', 90, '계산구간<br>병행보수', hdr(COLOR.adv)),
      gb.long('advTermChargeFee', 90, '청구보수', hdr(COLOR.adv)),
    ]),
    gb.group('일임보수', [  // L110
      gb.long('discrMinFee', 90, '청구기간<br>최저보수', hdr(COLOR.discr)),
      gb.long('discrTermMinFee', 90, '계산구간<br>최저보수', hdr(COLOR.discr)),
      gb.long('discrTermOccFee', 90, '계산구간<br>발생보수', hdr(COLOR.discr)),
      gb.long('discrTermWithFee', 90, '계산구간<br>병행보수', hdr(COLOR.discr)),
      gb.long('discrTermChargeFee', 90, '청구보수', hdr(COLOR.discr)),
    ]),
    gb.booleanYn('withYn', 70, '병행적용<br>여부'),  // L135
    gb.group('병행보수', [  // L111 HeaderGroupMap(0, 20) span 4
      gb.long('withFee', 90, '청구기간<br>병행보수'),
      gb.long('withTermWithFee', 90, '계산구간<br>병행보수'),
      gb.long('withTermOccFee', 90, '계산구간<br>발생보수'),
      gb.long('withTermChargeFee', 90, '계산구간<br>청구보수'),
    ].map(c => ({ ...c, headerStyle: { color: COLOR.with } }))),
  ], []);

  // [E1] retrieveButton[새로고침].Select (L78) · open() L71 → retrieve() L144-149: biz.Biz22_FeeChargeCalc.selectByContCorpId(contCorpId, chargeDate)
  const retrieve = useCallback(async () => {
    if (!row || row.contCorpId == null) { setRows([]); return; }
    setLoading(true);
    try {
      setRows(await bizFeeChargeApi.searchCalcs(row.contCorpId, row.chargeDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [row]);
  useEffect(() => { void retrieve(); }, [retrieve]);

  return (
    <LookupModal
      open={row !== null}
      title="최저보수청구 구간계산정보"
      width="min(1800px, 96vw)"
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancelButton[닫기].Select (L96) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 250px)', minHeight: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Button type="reset" onClick={retrieve}>새로고침</Button>
          {/* [E2] downloadButton[엑셀다운로드].Select (L84) → ExcelDownload?actionCode=biz22List&contCorpId&chargeDate — 엑셀 생성은 다음 단계 */}
          <Button type="download" onClick={() => { message.info('엑셀 파일 생성은 다음 단계에서 변환합니다.'); }}>엑셀다운로드</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BizFeeChargeCalc>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.feeChargeCalcId)}
            rowNumber={false}
            loading={loading}
            sumRow={{ labelField: 'termStartDate', label: '합계', sum: [...SUM_FIELDS] }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
