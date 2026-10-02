/**
 * [1075] 관리자 > 01. 고객관리 > 고객별 시스템정보 관리 (KFS 관리자 전용)
 * AS-IS: myOms/client/vi/sys/Sys01_Tab_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Input, Modal, Space, Splitter, Typography, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CompanyDetail } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { CompanyCreateModal } from './sys01/CompanyCreateModal';
import { CompanyInfoTabs } from './sys01/CompanyInfoTabs';

const gb = gbFor<CompanyDetail>();

/** AS-IS buildGrid() L180-204 — 컬럼 순서·폭 그대로 */
const buildGrid = () => [
  gb.booleanYn2('loginSecureYn', 100, '보안로그인'),  // L184
  gb.text('companyNm', 200, '고객명'),  // L185
  gb.textCenter('locNm', 120, 'Sub-Domain'),  // L186
  gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드'),  // L190
  gb.textCenter('icamAdvisCompanyCd', 80, 'ICAM<br>자문사코드'),  // L191
  gb.booleanYn2('useYn', 80, '사용여부'),  // L192
  gb.text('note', 250, '비고'),  // L193
  gb.text('empInfo', 150, '담당자(이름/부서/직책)'),  // L195
  gb.text('officeTelNo', 120, '대표전화'),  // L196
  gb.text('emailAddr', 150, '이메일주소'),  // L197
  gb.date('startDate', 100, '설립일'),  // L198
  gb.date('closeDate', 100, '계약종료일'),  // L199
  // ⚠DB없음 L200 icamCompanyType 80 "ICAM<br>회사유형" (sys01_icam_company_type 컬럼 없음)
];

export const Sys01_Tab_Company: React.FC = () => {
  const gridRef = useRef<AgGridReact<CompanyDetail>>(null);
  const [companyNm, setCompanyNm] = useState('');
  const [useOnly, setUseOnly] = useState(true);
  const [rows, setRows] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [createOpen, setCreateOpen] = useState(false);
  const selectAfterLoad = useRef<number | undefined>(undefined);

  const columnDefs = useMemo(buildGrid, []);

  // AS-IS retrieve() L206-218
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await sysApi.searchCompanyDetails(companyNm, String(useOnly)));
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [companyNm, useOnly]);

  // AS-IS 생성자 L111: this.retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // AS-IS retrieveTabpage() L168-178: 선택 회사로 하단 탭 조회 (CompanyInfoTabs가 companyId로 읽는다)
  const retrieveTabpage = (row: CompanyDetail | undefined) => setSelectedId(row?.companyId);

  // AS-IS insert() L220-222: Sys01_Edit_Company 팝업
  const insert = () => setCreateOpen(true);

  // AS-IS deleteCompany() L238-249: 삭제 후 탭 초기화
  const deleteCompany = async (list: CompanyDetail[]) => {
    try {
      await sysApi.deleteCompanies(list.map(c => c.companyId));
      setSelectedId(undefined);
      retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // AS-IS delete() L224-236 (delete는 JS 예약어라 onDelete): 확인 → YES면 deleteCompany(). 대상은 선택된 행 (체크박스 없음)
  const onDelete = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 고객사를 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '해당 고객사정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => deleteCompany(selected),
    });
  };

  // AS-IS: center(검색바+그리드) / south(탭, 450, split) 2분할. 모달은 Splitter 밖에 둔다(안에 두면 패널이 하나 더 생긴다)
  return (
    <>
      <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space wrap>
              <Typography.Text strong>고객명</Typography.Text>
              <Input style={{ width: 180 }} value={companyNm} allowClear onChange={e => setCompanyNm(e.target.value)} onPressEnter={retrieve} />
              <Checkbox checked={useOnly} onChange={e => setUseOnly(e.target.checked)}>사용고객만 보기</Checkbox>
              <Button type="primary" onClick={retrieve}>조회</Button>
              <Button onClick={insert}>등록</Button>
              <Button danger onClick={onDelete}>삭제</Button>
            </Space>
            <Typography.Text type="secondary">총 {rows.length} 건</Typography.Text>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<CompanyDetail>
              gridRef={gridRef}
              rowData={rows}
              loading={loading}
              columnDefs={columnDefs}
              sortable={false}
              getRowId={p => String(p.data.companyId)}
              // AS-IS grid.SelectionChanged → retrieveTabpage()
              onSelect={retrieveTabpage}
              onRowDataUpdated={e => {
                if (selectAfterLoad.current != null) {
                  const node = e.api.getRowNode(String(selectAfterLoad.current));
                  node?.setSelected(true, true);
                  if (node?.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                  selectAfterLoad.current = undefined;
                }
              }}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={450} min={240} max={900} style={{ padding: '0 12px 12px' }}>
          <CompanyInfoTabs
            companyId={selectedId}
            onSaved={c => setRows(prev => prev.map(r => (r.companyId === c.companyId ? c : r)))}
          />
        </Splitter.Panel>
      </Splitter>

      <CompanyCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={c => {
          setCreateOpen(false);
          selectAfterLoad.current = c.companyId;
          setSelectedId(c.companyId);
          retrieve();
        }}
      />
    </>
  );
};
