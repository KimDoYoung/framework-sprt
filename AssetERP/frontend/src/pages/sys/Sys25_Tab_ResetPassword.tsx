/**
 * [1182] 관리자 > 02. 시스템관리 > 비밀번호 초기화 (A19)
 * AS-IS: myApp/client/vi/sys/Sys25_Tab_ResetPassword.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L54-74: 툴바(성명 트리거 칸 "전체" + 조회) + 그리드(행번호, 체크박스 없는 단일 선택: 사번·본부(부서)·성명·상태(잠금 아이콘)·잠금해제·비밀번호 초기화). 여백 20/20/0/20
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 하나(성명)라 초기화(UX-02) 없음. 성명 칸은 원본처럼 직접 입력은 비우는 용도(비우면 전체)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PasswordPerson } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<PasswordPerson>();

export const Sys25_Tab_ResetPassword: React.FC = () => {
  const [rows, setRows] = useState<PasswordPerson[]>([]);
  // buttonSetting() L138-162: 성명 칸(빈칸 힌트 "전체"), 비우면 personId도 비운다
  const [personName, setPersonName] = useState('');
  const [selectPersonId, setSelectPersonId] = useState<number | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // retrieve() L182-204: 사원을 안 골랐으면 selectByGrade, 골랐으면 selectByPasswordPersonId (회사·기준일은 서버)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchPasswordPersons(selectPersonId ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [selectPersonId]);

  // [E0] 화면 열림 (생성자 L54-74) → buttonSetting(), retrieve()
  useEffect(() => {
    retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] msgBox.DialogHide [YES] (L84) → resetLock() L206-219: lockYn = false → "잠금해제를 완료하였습니다" → retrieve()
  const resetLock = async (row: PasswordPerson) => {
    try {
      await sysApi.unlockPerson(row.personId);
      message.success('잠금해제를 완료하였습니다');
    } catch (err) {
      message.error(errorMessage(err, '잠금해제 실패'));
    }
    await retrieve();
  };

  // [E2] msgBox.DialogHide [YES] (L108) → resetPassword() L221-235: sys.Sys25_Password.insert(password = null) → "비밀번호 초기화를 완료하였습니다." → retrieve()
  const resetPassword = async (row: PasswordPerson) => {
    try {
      await sysApi.resetPassword(row.personId);
      message.success('비밀번호 초기화를 완료하였습니다.');
    } catch (err) {
      message.error(errorMessage(err, '비밀번호 초기화 실패'));
    }
    await retrieve();
  };

  const confirm = (row: PasswordPerson, what: string, run: (row: PasswordPerson) => void) => {
    Modal.confirm({
      title: '확인',
      content: `'${row.empKorName ?? ''}' ${what}를 진행하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: () => run(row),
    });
  };

  // buildGrid() L76-136
  const columnDefs = useMemo(() => [
    gb.textCenter('empNo', 100, '사번'),  // L128
    gb.text('orgName', 300, '본부(부서)'),  // L129
    gb.textCenter('empKorName', 100, '성명'),  // L130
    gb.booleanIcon('lockYn', 100, '상태'),  // L131 addBooleanIcon
    iconCell<PasswordPerson>('check', 'actionCell1', 150, '잠금해제', row => confirm(row, '잠금해제', resetLock)),  // L132 actionCell1 → 확인 → resetLock()
    iconCell<PasswordPerson>('check', 'actionCell2', 150, '비밀번호 초기화', row => confirm(row, '비밀번호 초기화', resetPassword)),  // L133 actionCell2 → 확인 → resetPassword()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: '20px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E5] retrieveButton[조회].Select (L156) → retrieve() */}
      <SearchBar onSearch={retrieve}>
        <SearchBar.Field label="성명">
          {/* [E3] selectPersonField.TriggerClick (L141) → lookupPerson() L164-180, [E4] selectPersonField.Change (L147) → 비우면 personId = null */}
          <Input style={{ width: 150 }} placeholder="전체" value={personName}
            suffix={<SearchOutlined onClick={() => setLookupOpen(true)} style={{ cursor: 'pointer' }} />}
            onClick={() => setLookupOpen(true)}
            onChange={e => { setPersonName(e.target.value); if (!e.target.value) setSelectPersonId(null); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<PasswordPerson>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.personId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false }}
        />
      </div>
      <Emp00_Lookup_SelectSingle
        open={lookupOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        onClose={() => setLookupOpen(false)}
        onResult={row => {
          // lookupPerson() callback: personId == null([전체]) → 칸·personId 비움, 아니면 성명·personId
          setPersonName(row ? row.korNm ?? '' : '');
          setSelectPersonId(row ? row.personId : null);
          setLookupOpen(false);
        }}
      />
    </div>
  );
};
