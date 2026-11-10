/**
 * [1334] 커뮤니티 > 90. 기타 > 리모트뷰 사용기록관리 (Z15)
 * AS-IS: myApp/client/vi/kfs/Kfs01_Tab_RemoteView.java (309줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: center = 툴바(조회기간 ~ · 사원명 100 · "미입력건만 보기" 체크 · [조회][저장][삭제][엑셀업로드]) + 셀 편집 그리드(행번호, 체크박스 다중)
 * 로그인 사원이 "정서현"이면 관리자(사원명 입력·삭제·엑셀업로드·관리자확인 체크 편집), 아니면 사원명=내 이름(입력 불가), [삭제]·[엑셀업로드] 숨김, 관리자확인은 Y/N 표시만 (settings() L128-139, buildGrid() L212-216)
 * 스타일: SG (견본 — docs/page-style/SG/Tdm01_Tab_Hr.tsx)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { kfsApi } from '@/api/kfs';
import { errorMessage } from '@/api/client';
import { RemoteView } from '@/types/kfs';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<RemoteView>();
const DATE = 'YYYY-MM-DD';
/** AS-IS가 하드코딩한 관리자 (settings() L128, buildGrid() L212) */
const MANAGER_NAME = '정서현';

export const Kfs01_Tab_RemoteView: React.FC = () => {
  const user = useLoginUser();
  const isManager = user.name === MANAGER_NAME;
  const excelForm = useRef<FileUpdownFormHandle>(null);

  // settings() L126-201: 조회기간 = 올해 1월 1일 ~ 오늘, "미입력건만 보기" 처음 체크, 사원명 = 관리자만 입력(그 밖은 내 이름·입력 불가)
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs(), personName: isManager ? '' : user.name, checkBox: true }));
  const { startDate, closeDate, personName, checkBox } = sp.values;

  const crud = useGridCrud<RemoteView>({
    idField: 'remoteViewId',
    // retrieve() L221-254: kfs.Kfs01_RemoteView.selectByText(관리자) / selectByPersonName(그 밖) — 서버가 로그인 이름으로 고른다
    search: useCallback(() => {
      const v = sp.current.current;
      return kfsApi.searchRemoteViews({ personName: v.personName, startDate: v.startDate.format(DATE), closeDate: v.closeDate.format(DATE), checkBox: v.checkBox });
    }, [sp]),
    // update() L256-264: kfs.Kfs01_RemoteView.update → retrieve()
    save: kfsApi.saveRemoteViews,
    reloadAfterSave: true,
    // [E4] deleteButton[삭제].Select (L170) "선택한 정보를 삭제하시겠습니까?"(제목 삭제) → [E5] YES → delete() L266-277
    remove: kfsApi.deleteRemoteViews,
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    newRow: useCallback(() => ({}), []),   // 원본에 [등록] 버튼이 없다(addRow를 쓰지 않음)
  });
  // 오래 사는 콜백이 최신 crud 를 부르게 한다 (crud 는 rows 가 바뀔 때마다 새 객체)
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // [E0] 화면 열림 (생성자 L76-124) → settings(), retrieve()
  useEffect(() => { void crudRef.current.retrieve(); }, []);

  // [E6] excelUploadButton[엑셀업로드].Select (L186) → excelUpload() L279-295: 파일을 고르면 ExcelUpload?uploadType=remoteViewUpload
  // [E8] fileUploadField.Change (L287) → uploadExcelForm.submit() · [E7] uploadExcelForm.SubmitComplete (L195) → retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await kfsApi.uploadRemoteViewsExcel(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void crud.retrieve();
  };

  // buildGrid() L203-219 (관리자확인 = 관리자는 addBoolean 편집 체크, 그 밖은 addBooleanYn)
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 120, '사용자'),                              // L207
    gb.date('date', 120, '사용일자'),                                         // L208
    gb.textCenter('startTime', 120, '시작시간'),                              // L209
    gb.textCenter('closeTime', 120, '종료시간'),                              // L210
    gb.text('reason', 650, '업무내용', { editor: 'text' }),                   // L211
    isManager ? gb.boolean('managerYn', 100, '관리자확인', { editable: true }) : gb.booleanYn('managerYn', 100, '관리자확인'),  // L212-216
  ], [isManager]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L158) → retrieve(), [E1] personName.KeyPress [Enter] (L144) → retrieve() */}
        <SearchBar
          onSearch={crud.retrieve}
          loading={crud.loading}
          extra={<>
            {/* [E3] updateButton[저장].Select (L164) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {isManager && <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>}
            {isManager && <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>}
            <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
          </>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <SearchBar.Input style={{ width: 100 }} value={personName} disabled={!isManager} onChange={e => sp.set('personName', e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={checkBox} onChange={e => sp.set('checkBox', e.target.checked)}>미입력건만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<RemoteView> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
};
