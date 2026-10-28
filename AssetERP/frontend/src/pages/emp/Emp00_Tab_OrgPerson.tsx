/**
 * [1030] 경영관리 > 01. 조직 및 사원관리 > 조직별 사원조회 (S04)
 * AS-IS: myApp/client/vi/emp/Emp00_Tab_OrgPerson.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L77-154, SGT): 위 툴바(기준일·[조회]) / 왼쪽 조직 트리(Org01_Tree_OrgCode, 20%, 분할) / 가운데 사원 그리드
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Splitter, Tree } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { orgCodeApi } from '@/api/org';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { OrgPerson } from '@/types/emp';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { toTree } from '../org/Org01_Move_OrgCode';

const gb = gbFor<OrgPerson>();

/** buildGrid() L167-183 — 이미지 열은 EmpImageCell(L67-75): FileDownload?fileType=image&parentId=사원ID, 80×100, 여백 5 */
const columnDefs = [
  { // L169 addCell(personIdString, 110, "이미지", EmpImageCell)
    colId: 'personIdString', headerName: '이미지', width: 110, sortable: false,
    cellStyle: { textAlign: 'center' },
    cellRenderer: (p: { data?: OrgPerson }) => p.data ? (
      <img alt="" style={{ height: 100, width: 80, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: p.data.personId })} />
    ) : null,
  },
  gb.text('empKorName', 100, '성명'), // L170
  gb.text('posName', 80, '직위'), // L172
  gb.text('orgKorName', 150, '본부(부서)'), // L173
  gb.text('titleName2', 100, '직책'), // L174
  gb.date('hireDate', 90, '입사일'), // L175 (읽기 전용 날짜 열 UX-08: 90)
  gb.text('emailAddress', 200, 'e-mail'), // L176
  gb.text('mobileTelNo', 120, 'H˙P'), // L177
  gb.text('officeTelNo', 120, '전화'), // L178
  gb.text('empNo', 80, '사번'), // L179
];

export const Emp00_Tab_OrgPerson: React.FC = () => {
  const [baseDate, setBaseDate] = useState<Dayjs | null>(dayjs()); // L84-85: 기준일 = 오늘(LoginUser.getToday)
  const [orgCodes, setOrgCodes] = useState<OrgCode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [rows, setRows] = useState<OrgPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const treeData = useMemo(() => toTree(orgCodes), [orgCodes]);
  const base = () => (baseDate ?? dayjs()).format('YYYY-MM-DD');

  // [E0] 화면 열림 (생성자 L77-154) / [E1] retrieveButton[조회].Select (L87) → retrieve() L186-188:
  // buildTree.retrieve(baseDate) → 서비스 org.Org01_Code.selectByCompanyId, 첫 레벨만 펼친다(getServiceResult L82-98). 그리드는 그대로 둔다
  const retrieve = async () => {
    try {
      const list = await orgCodeApi.searchOrgCodes(base());
      setSelectedKey(null);
      setOrgCodes(list);
      setExpandedKeys(toTree(list).map(n => n.key));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E3] orgTree.SelectionChanged [data != null] (L106) → 서비스 emp.Emp00_TransInfo.selectByAllOrgCodeId(orgCodeId, baseDate, companyId)
  const onSelectOrg = async (codeId: number) => {
    setSelectedKey(codeId);
    setLoading(true);
    try {
      setRows(await empApi.searchOrgPersons(codeId, base()));
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2 생략] viewOrgChartButton[조직도보기].Select (L96) → viewOrgChart() L156-165: 원본도 툴바에 넣지 않는다(L102 주석 처리) — Org02_View_Chart(조직도 jsp)는 범위 밖
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: '#fff', boxSizing: 'border-box' }}>
      <SearchBar onSearch={retrieve}>
        <SearchBar.Field label="기준일">
          <DatePicker style={{ width: 140 }} value={baseDate} onChange={setBaseDate} format="YYYY-MM-DD" />
        </SearchBar.Field>
      </SearchBar>
      <Splitter layout="horizontal" style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="20%" min={100}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', background: '#fff', overflow: 'auto', boxSizing: 'border-box' }}>
            {treeData.length > 0 && (
              <Tree
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={keys => setExpandedKeys(keys)}
                selectedKeys={selectedKey == null ? [] : [selectedKey]}
                onSelect={keys => { if (keys.length) onSelectOrg(Number(keys[0])); }}
              />
            )}
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box' }}>
            <SingleGrid<OrgPerson>
              rowData={rows}
              columnDefs={columnDefs}
              loading={loading}
              rowHeight={110}
              getRowId={p => String(p.data.transId)}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
