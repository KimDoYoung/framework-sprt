/**
 * [1442] 관리자 > 02. 시스템관리 > 로그인 Mac 주소 관리 (A21)
 * AS-IS: myApp/client/vi/sys/Sys27_Tab_LoginManage.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-93: 툴바(회사명 콤보 · 사원명 돋보기 칸 · 조회 · 감추기) + 그리드(행번호, 체크박스 다중). 승인여부 체크박스를 바꾸면 확인창 → 저장.
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건 2개 → 초기화 UX-02)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { LoginManage } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { CompanyPopupField } from '@/components/lookup/CompanyPopupField';

const gb = gbFor<LoginManage>();
const ALL = '%';  // companyName: "전체" 또는 "%"이면 모든 고객사
const ALL_PERSON = '전체';  // personName 기본 글자

/** AS-IS buildGrid() L187-200 */
const columnDefs = [
  gb.textCenter('openDateString', 200, '신청일'),  // L190
  gb.text('companyNm', 250, '회사명'),  // L191
  gb.textCenter('personNm', 100, '성명'),  // L192
  gb.textCenter('placeNm', 100, '접속구분'),  // L193
  gb.textCenter('macAddress', 250, 'Mac 주소'),  // L194
  gb.textArea('reason', 400, '사유'),  // L195
  gb.boolean('confirmYn', 50, '승인여부', { editable: true }),  // L196 — 바꾸면 [E4] 확인창
  gb.textCenter('confirmDateString', 200, '승인(취소)일'),  // L197
];

export const Sys27_Tab_LoginManage: React.FC = () => {
  const gridRef = useRef<AgGridReact<LoginManage>>(null);
  const [companyCd, setCompanyCd] = useState(ALL);
  // settings() L95-: personName = "전체", personId = null (돋보기 → 사원찾기)
  const [personName, setPersonName] = useState(ALL_PERSON);
  const [personId, setPersonId] = useState<number | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<LoginManage[]>([]);


  // retrieve() L202-230: 서비스 sys.Sys27_LoginManage.selectByText(companyId '%'|ID, personId '%'|ID)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchLoginManages(companyCd, personId == null ? ALL : String(personId)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyCd, personId]);

  // [E0] 화면 열림 (생성자 L61-93) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E1] personName.TriggerClick (L103) → Emp00_Lookup_SelectSingle.open(Long.parseLong(companyName.getCode()), 오늘, callback)
  // 원본은 회사가 '전체'('%')면 parseLong이 실패한다 → 먼저 회사를 고르라고 알린다(작업기록 제안)
  const openPersonLookup = () => {
    if (companyCd === ALL) {
      message.warning('회사명을 먼저 선택해주세요');
      return;
    }
    setLookupOpen(true);
  };

  // [E3] collapseButton[감추기].Select (L130) → collapse() L232-249: 체크한 행으로 sys.Sys27_LoginManage.updateCollapse → retrieve().
  // 원본 매퍼에 updateCollapse SQL이 없어 체크한 행이 있으면 서버가 실패한다(없으면 그냥 다시 조회) — 작업기록 제안
  const collapse = async () => {
    if ((gridRef.current?.api.getSelectedRows() ?? []).length > 0) {
      message.warning('감추기는 원본에도 동작하는 SQL이 없어 지원하지 않습니다');
      return;
    }
    await retrieve();
  };

  // [E4] grid.getStore().StoreRecordChange [YES] (L136) / [E5] msgBox.DialogHide [YES] (L156) → 서비스 sys.Sys27_LoginManage.updateConfirmYn → 그리드 행 갱신
  const onConfirmChanged = (row: LoginManage) => {
    const confirmYn = row.confirmYn === 'true';
    Modal.confirm({
      title: '확인',
      content: confirmYn ? '해당 건을 승인신청하시겠습니까?' : '해당 건을 승인취소하시겠습니까?',
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          const saved = await sysApi.updateLoginManageConfirm(row.loginManageId, row.personId, confirmYn);
          setRows(prev => prev.map(r => (r.loginManageId === saved.loginManageId ? saved : r)));
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        }
      },
    });
  };


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 8, background: '#fff', boxSizing: 'border-box' }}>
      {/* [E2] retrieveButton[조회].Select (L124) → retrieve() */}
      <SearchBar onSearch={retrieve} onReset={() => { setCompanyCd(ALL); setPersonName(ALL_PERSON); setPersonId(null); }}
        extra={<Button type="collapse" onClick={collapse}>감추기</Button>}>
        <SearchBar.Field label="회사명">
          <CompanyPopupField value={companyCd} onChange={setCompanyCd} />
        </SearchBar.Field>
        <SearchBar.Field label="사원명">
          <Input readOnly style={{ width: 100, cursor: 'pointer' }} value={personName} suffix={<SearchOutlined />} onClick={openPersonLookup} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<LoginManage>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.loginManageId)}
          onCellValueChanged={e => e.colDef.field === 'confirmYn' && e.data && onConfirmChanged(e.data)}
        />
      </div>
      <Emp00_Lookup_SelectSingle
        open={lookupOpen}
        companyId={companyCd === ALL ? undefined : Number(companyCd)}
        transDate={dayjs().format('YYYY-MM-DD')}
        onClose={() => setLookupOpen(false)}
        onResult={row => {
          // callback.execute(result): result == null([전체]) → "전체", personId = null, 아니면 성명·personId
          setPersonName(row ? row.korNm ?? '' : ALL_PERSON);
          setPersonId(row ? row.personId : null);
          setLookupOpen(false);
        }}
      />
    </div>
  );
};
