/**
 * [1079] 관리자 > 03. 코드관리 > 고객사 공통코드 / [1248] 관리자 > 09. 기타 > 공통코드  (A14)
 * AS-IS: myApp/client/vi/sys/Sys08_Tab_CodeKindClient.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L60-164): west = 툴바(높이 50) + 코드구분 그리드 (폭 750, 최대 1100, 분할, 여백 20/-2/22/20),
 *   center = Sys09_Grid_Code(isAdmin = false, retrieveCode(codeKind, companyId) — 항상 편집 가능, 여백 20/20/20/0, 분할)
 * 회사명 칸·코드복사 버튼은 로그인 회사가 0(admin)일 때만 (L103-124).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Splitter, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CodeKind, Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys09_Grid_Code } from './Sys09_Grid_Code';
import { Sys01_Lookup_SelectSingle } from './Sys01_Lookup_SelectSingle';
import { Sys01_Lookup_SelectMulti } from './Sys01_Lookup_SelectMulti';

const gb = gbFor<CodeKind>();

/** AS-IS buildGrid() L166-176 (편집기 없음, 체크박스 없음 = 단일 선택) */
const buildGrid = () => [
  gb.text('kindCd', 150, '구분코드'),  // L171
  gb.text('kindNm', 180, '코드구분'),  // L172
  gb.boolean('sysYn', 60, '시스템'),  // L173 sysYnFlag = sysYn == 'true'. 저장 버튼이 없어 보기 전용(작업방법)
  gb.textArea('note', 300, '상세설명'),  // L174
];

export const Sys08_Tab_CodeKindClient: React.FC = () => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;
  const gridRef = useRef<AgGridReact<CodeKind>>(null);
  const columnDefs = useMemo(buildGrid, []);
  const [rows, setRows] = useState<CodeKind[]>([]);
  const [codeKindName, setCodeKindName] = useState('');
  // 생성자 L61-65: companyId = 로그인 회사 (admin이면 0). 회사명 칸 처음 글은 "ADMIN"(L82)
  const [companyId, setCompanyId] = useState<number>(user.companyId);
  const [companyName, setCompanyName] = useState('ADMIN');
  const [selected, setSelected] = useState<CodeKind | null>(null);
  const [singleOpen, setSingleOpen] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);

  // retrieve() L179-184: kindName = 입력값, sysYn = "false"(사용자 관리내용만 조회)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchCodeKinds(codeKindName, 'false'));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [codeKindName]);

  // [E0] 화면 열림 (생성자 L60-164) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E3] companyName.TriggerClick (L83-102) → Sys01_Lookup_SelectSingle: 결과가 있으면 회사명·companyId를 바꾸고,
  //   취소(null)여도 선택한 코드구분으로 gridCode.retrieveCode(codeKind, companyId) 다시 조회
  const onCompanyResult = (resultModel: Company | null) => {
    setSingleOpen(false);
    if (resultModel) {
      setCompanyName(resultModel.companyNm);
      setCompanyId(resultModel.companyId);
    }
    setSelected(s => (s ? { ...s } : s));
  };

  // [E2] codeCopyButton[코드복사].Select (L73) → copyChk() L225-263
  const copyChk = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
    if (selectedRows.length > 1) {
      message.warning('복사할 코드를 한개만 선택해주세요');
      return;
    } else if (selectedRows.length < 1) {
      message.warning('복사할 코드를 선택해주세요');
      return;
    }
    setMultiOpen(true);
  };

  // Sys01_Lookup_SelectMulti 결과 → 확인 창
  const onCopyCompanies = (companyList: Company[]) => {
    setMultiOpen(false);
    const codeKindModel = gridRef.current?.api.getSelectedRows()[0];
    if (!codeKindModel) return;
    Modal.confirm({
      title: '코드 복사',
      content: `${companyList.length}개의 회사에 복사하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      // [E7] msgBox.DialogHide [YES] (L244) → codeCopy()
      onOk: () => codeCopy(companyList, codeKindModel),
    });
  };

  // codeCopy() L265-280: 서비스 sys.Sys09_Code.codeInsert(companyId, companyList, codeKindId)
  const codeCopy = async (companyList: Company[], codeKindModel: CodeKind) => {
    try {
      await sysApi.copyCodes(codeKindModel.codeKindId, companyId, companyList.map(c => c.companyId));
      message.success('코드 복사가 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '코드 복사 실패'));
    }
  };

  // [E6 생략] msgBox.DialogHide [YES] (L208) → sys.Sys08_CodeKind.delete — deleteRow()·update()·insertRow()는 public이지만 버튼이 없어 부르는 곳이 없다

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={750} min={300} max={1100}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Space>
                {isAdminCompany && (
                  <>
                    <Typography.Text strong>회사명</Typography.Text>
                    {/* [E3] companyName.TriggerClick (L83) → Sys01_Lookup_SelectSingle — 입력은 편집 불가(L81) */}
                    <Input style={{ width: 150, cursor: 'pointer' }} readOnly value={companyName}
                      suffix={<SearchOutlined />} onClick={() => setSingleOpen(true)} />
                  </>
                )}
                <Typography.Text strong>코드구분명</Typography.Text>
                {/* [E4] codeKindName.KeyPress [Enter] (L115) → retrieve() */}
                <Input style={{ width: 150 }} value={codeKindName}
                  onChange={e => setCodeKindName(e.target.value)} onPressEnter={retrieve} />
                {/* [E1] retrieveButton[조회].Select (L67) → retrieve() */}
                <Button type="search" onClick={retrieve}>조회</Button>
                {/* [E2] codeCopyButton[코드복사].Select (L73) → copyChk() — admin 회사만(L122) */}
                {isAdminCompany && <Button type="change" onClick={copyChk}>코드복사</Button>}
              </Space>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E5] grid.SelectionChanged (L155) → gridCode.retrieveCode(선택한 코드구분, companyId) */}
              <SingleGrid<CodeKind>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.codeKindId)}
                onSelectionChanged={e => { const row = e.api.getSelectedRows()[0]; if (row) setSelected(row); }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200} max={1000}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9' }}>
            <Sys09_Grid_Code isAdmin={false} codeKind={selected} companyId={companyId} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <Sys01_Lookup_SelectSingle open={singleOpen} onResult={onCompanyResult} />
      <Sys01_Lookup_SelectMulti open={multiOpen} onResult={onCopyCompanies} onClose={() => setMultiOpen(false)} />
    </div>
  );
};
