/**
 * [1075] 관리자 > 01. 고객관리 > 고객별 시스템정보 관리  (A15)
 * AS-IS: myApp/client/vi/sys/Sys01_Tab_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L63-107): 가운데 = 툴바 + 고객 그리드, 아래 = 탭 6개(높이 450, 최대 900, 분할 조절)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Space, Splitter, Tabs, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys01_Edit_Company } from './Sys01_Edit_Company';
import { Sys03_Lookup_CompanyMenu } from './Sys03_Lookup_CompanyMenu';

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

/** 하위 탭이 받는 값 (AS-IS InterfaceTabPage.retrieve(param{companyId})) */
export interface CompanyTabProps {
  companyId?: number;
}

/** 아직 변환하지 않은 탭 — 단계가 끝나면 실제 탭 컴포넌트로 바꾼다 (A15-작업방법 "단계") */
const PendingTab = (name: string, step: string): React.FC<CompanyTabProps> => ({ companyId }) => (
  <div style={{ padding: 24, color: '#888' }}>
    {name}({step}) — 아직 변환하지 않은 탭입니다. {companyId ? `선택한 회사 ID: ${companyId}` : ''}
  </div>
);

/** 생성자 L79-84: tabPanel.add(…) 순서 그대로 */
const TABS: { key: string; label: string; page: React.FC<CompanyTabProps> }[] = [
  { key: 'info01', label: '관리정보', page: PendingTab('Sys01_TabPage_Info01', '2단계') },
  { key: 'info02', label: '기본정보', page: PendingTab('Sys01_TabPage_Info02', '3단계') },
  { key: 'info03', label: '전자결재·내부통제', page: PendingTab('Sys01_TabPage_Info03', '3단계') },
  { key: 'info04', label: '경영·회계', page: PendingTab('Sys01_TabPage_Info04', '3단계') },
  { key: 'user', label: '고객별 관리자', page: PendingTab('Sys02_Tab_User', '2단계') },
  { key: 'specificMenu', label: '특정매뉴 권한', page: PendingTab('Sys50_TabPage_SpecificMenu', '3단계') },
];

export const Sys01_Tab_Company: React.FC = () => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const [companyName, setCompanyName] = useState('');
  const [useYn, setUseYn] = useState(true); // settings() 초기값: "사용고객만 보기" 체크
  const [rows, setRows] = useState<Company[]>([]);
  const [selected, setSelected] = useState<Company>();
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [editOpen, setEditOpen] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L232-237: 서비스 sys.Sys01_Company.selectByName(companyName, useYn)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchCompanies(companyName, useYn));
      setSelected(undefined);
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

  // delete() L243-255: 확인 → [E9] YES → deleteCompany()
  const deleteCompany = async () => {
    // deleteCompany() L257-261: GridDeleteData — 선택한 행을 지우고 목록에서 뺀다(완료 메시지 없음)
    const ids = selected ? [selected.companyId] : [];
    if (ids.length === 0) return;
    try {
      await sysApi.deleteCompanies(ids);
      setRows(prev => prev.filter(r => !ids.includes(r.companyId)));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };
  const remove = () =>
    Modal.confirm({ title: '삭제', content: '해당 고객사정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오', onOk: deleteCompany });

  // copyMenu() L263-273: grid.mask("Loading") → 조회창 Sys03_Lookup_CompanyMenu → 콜백: unmask
  const copyMenu = () => setLookupOpen(true);

  // commentUpdate() L275-307
  const commentUpdate = () => {
    if (!selected) return message.warning('회사를 선택해주세요');
    const target = selected;
    Modal.confirm({
      title: '확인',
      content: `'${target.companyNm}' 에 '0' 회사의 문서개요를 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 500,
      // [E10] msgBox.DialogHide [YES] (L283) → 서비스 dcr.Dcr01_ClassTree.commentInsert(companyId)
      onOk: async () => {
        try {
          await sysApi.copyDcrComments(target.companyId);
          message.info('문서분류의 개요가 복사완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '복사 실패'));
        }
      },
    });
  };

  // [E0] 화면 열림 (생성자 L63-107) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E7] grid.SelectionChanged [선택>0] (L151) / [E8] tabPanel.Selection (L159) → retrieveTabpage() L169-179:
  //   선택한 회사로 지금 보이는 탭만 조회 — 탭 컴포넌트가 companyId가 바뀌거나 탭이 열릴 때 조회한다(안 보이는 탭은 그리지 않음)
  const ActivePage = TABS.find(t => t.key === activeTab)!.page;

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0' }}>
          <Space wrap>
            <Typography.Text strong>고객명</Typography.Text>
            {/* [E1] companyName.KeyDown [Enter] (L113) → retrieve() */}
            <Input style={{ width: 180 }} value={companyName} allowClear onChange={e => setCompanyName(e.target.value)} onPressEnter={retrieve} />
            <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
            {/* [E2] retrieveButton[조회].Select (L121) */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E3] insertButton[등록].Select (L127) */}
            <Button type="register" onClick={insert}>등록</Button>
            {/* [E4] deleteButton[삭제].Select (L133) */}
            <Button type="delete" onClick={remove}>삭제</Button>
            {/* [E5] copyMenuButton[매뉴권한복사(초기)].Select (L139) */}
            <Button type="change" onClick={copyMenu}>매뉴권한복사(초기)</Button>
            {/* [E6] addDcrComment[문서개요복사].Select (L145) */}
            <Button type="change" onClick={commentUpdate}>문서개요복사</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<Company>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              loading={lookupOpen}
              getRowId={p => String(p.data.companyId)}
              onSelect={setSelected}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={450} max={900} min={100}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={TABS.map(t => ({ key: t.key, label: t.label }))}
            style={{ flex: 'none', marginBottom: 0 }}
          />
          <div style={{ flex: 1, minHeight: 0 }}>
            <ActivePage companyId={selected?.companyId} />
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
    <Sys01_Edit_Company open={editOpen} onClose={() => setEditOpen(false)} onSaved={onSaved} />
    <Sys03_Lookup_CompanyMenu open={lookupOpen} onClose={() => setLookupOpen(false)} />
    </>
  );
};
