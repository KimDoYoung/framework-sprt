/**
 * [1075] 관리자 > 01. 고객관리 > 고객별 시스템정보 관리  (A15 — 1단계: 고객 목록 + 신규고객사 등록)
 * AS-IS: myApp/client/vi/sys/Sys01_Tab_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 1단계 범위(사용자 지시 2026-10-07 "회사추가까지만"): 삭제·매뉴권한복사·문서개요복사·하위 탭은 다음 단계에서 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Space, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys01_Edit_Company } from './Sys01_Edit_Company';

const gb = gbFor<Company>();

/** AS-IS buildGrid() L181-230 (색인 Grid Spec). ⚠DB없음으로 표시된 이름 컬럼은 SQL이 f_cdnm으로 계산한다 */
const buildGrid = () => [
  gb.booleanYn2('loginSecureYn', 100, '보안로그인'),  // L185
  gb.text('companyNm', 200, '고객명'),  // L186
  gb.textCenter('locNm', 120, 'Sub-Domain'),  // L187
  gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드'),  // L191
  gb.textCenter('icamAdvisCompanyCd', 80, 'ICAM<br>자문사코드'),  // L192
  gb.booleanYn2('useYn', 80, '사용여부'),  // L193
  gb.text('note', 250, '비고'),  // L194
  gb.text('empInfo', 150, '담당자(이름/부서/직책)'),  // L198
  gb.text('mobileTelNo', 120, '비상전화'),  // L199
  gb.text('officeTelNo', 120, '대표전화'),  // L200
  gb.text('fullAddress', 350, '주소'),  // L204
  gb.textCenter('companyRepNm', 150, '대외문서(대표이사)'),  // L206
  gb.textCenter('mailInfo', 120, '메일서버정보'),  // L208
  gb.booleanYn2('mailLogYn', 80, '메일기록'),  // L209
  gb.booleanYn2('apprStepLockYn', 80, '결재선<br>Lock'),  // L210
  gb.text('dcrNumberingNm', 100, '문서번호<br>채번방식'),  // L211
  gb.booleanYn2('dcrDetailUseYn', 80, '문서세부<br>분류사용'),  // L212
  gb.booleanYn2('aprManagerInfoYn', 120, '대외문서<br>담당자정보포함'),  // L213
  gb.text('leaveMonthNm', 80, '휴가결산<br>(월)'),  // L215
  gb.booleanYn2('leaveYn', 80, '휴가<br>초과허용'),  // L216
  gb.longCenter('leaveCompulsionRt', 80, '휴가의무<br>사용율(%)'),  // L217
  gb.textCenter('icsCheckCycleNm', 80, '내부통제<br>체크주기'),  // L218
  gb.textCenter('icsComplyCycleNm', 100, '임직원준수점검<br>체크주기'),  // L219
  gb.text('taxTypeNm', 80, '과세구분'),  // L221
  gb.text('accountCloseMonthNm', 80, '회계결산<br>(월)'),  // L222
  gb.text('ownerCapitalApplyNm', 80, '자기자본<br>적용일'),  // L223
  gb.booleanYn2('astManagerAutoYn', 120, '고유자산담당자<br>자동설정'),  // L224
  gb.booleanYn2('icsGuideYn', 120, '법규 연결<br>가이드'),  // L226
  gb.date('noticeDate', 100, '시스템사용<br>시작일'),  // L227
];

export const Sys01_Tab_Company: React.FC = () => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const [companyName, setCompanyName] = useState('');
  const [useYn, setUseYn] = useState(true); // settings() 초기값: "사용고객만 보기" 체크
  const [rows, setRows] = useState<Company[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L232-237: 서비스 sys.Sys01_Company.selectByName(companyName, useYn)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchCompanies(companyName, useYn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyName, useYn]);

  // insert() L239-241: 팝업 Sys01_Edit_Company 열기
  const insert = () => setEditOpen(true);

  // Sys01_Edit_Company.update() 콜백: grid.getStore().add(resultModel) + select
  const onSaved = (saved: Company) => {
    setRows(prev => [...prev, saved]);
    setTimeout(() => {
      const node = gridRef.current?.api.getRowNode(String(saved.companyId));
      node?.setSelected(true, true);
      if (node?.rowIndex != null) gridRef.current?.api.ensureIndexVisible(node.rowIndex);
    });
  };

  // [E0] 화면 열림 (생성자 L63-107) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E4 생략] deleteButton[삭제] → delete()/deleteCompany(): 1단계 범위 밖(회사추가까지만, 사용자 지시)
  // [E5 생략] copyMenuButton[매뉴권한복사(초기)] → copyMenu(): 다음 단계(회사에 권한부여)
  // [E6 생략] addDcrComment[문서개요복사] → commentUpdate(): 1단계 범위 밖
  // [E7 생략] grid.SelectionChanged → retrieveTabpage(): 하위 탭(관리정보 등 6개)은 다음 단계
  // [E8 생략] tabPanel.Selection → retrieveTabpage(): 위와 같음
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>고객명:</Typography.Text>
        {/* [E1] companyName.KeyDown [Enter] (L113) → retrieve() */}
        <Input style={{ width: 180 }} value={companyName} allowClear onChange={e => setCompanyName(e.target.value)} onPressEnter={retrieve} />
        <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
        {/* [E2] retrieveButton[조회].Select (L121) → retrieve() */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E3] insertButton[등록].Select (L127) → insert() */}
        <Button type="register" onClick={insert}>등록</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<Company>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.companyId)}
        />
      </div>
      <Sys01_Edit_Company open={editOpen} onClose={() => setEditOpen(false)} onSaved={onSaved} />
    </div>
  );
};
