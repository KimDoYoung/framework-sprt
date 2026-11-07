/**
 * 과거심사필번호 조회창 (EE76) — 사전확인 신청창(Ics40_Edit_DcrPreconfirm)의 과거심사필번호 칸(돋보기)이 연다
 * AS-IS: myApp/client/vi/ics/Ics40_Lookup_SelectSingle.java (179줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1050×450(원본) → 열 폭 합계(대장분류 100·내용 500·제공처 200·심사필번호 100 + 행번호·선택 60 + 여백 130) 기준 1090 (03 원칙 21):
 *   검색줄(조회기간 시작 ~ 종료 · 검색 "내용/제공처" 200 · [조회]) + 단일 선택 그리드 + [확인][닫기]
 * open(callback) L47: 열 때 곧바로 retrieve() — ics.Ics40_DcrPreconfirm.selectByDate(statusCode "20" = 승인된 것만)
 * 호출처 Ics40_Edit_DcrPreconfirm(사전확인 신청창)의 과거심사필번호 칸 — 2026-11-05 연결(13-누락대장 4-1)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { IcsDcrPreconfirm } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar, useSearchParams } from '@/components/search';

const gb = gbFor<IcsDcrPreconfirm>();
const FMT = 'YYYY-MM-DD';

/** buildGrid() L112-122 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('dcrTypeName', 100, '대장분류'),        // L116
  gb.textArea('content', 500, '내용'),            // L117
  gb.text('provideCo', 200, '제공처'),            // L118
  gb.textCenter('apprNoPrefix', 100, '심사필번호'),  // L119
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(model): [확인]·더블클릭이면 고른 사전확인. 닫기는 이 창이 onClose로 한다 */
  onResult: (row: IcsDcrPreconfirm) => void;
  onClose: () => void;
}

export const Ics40_Lookup_SelectSingle: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<IcsDcrPreconfirm>>(null);
  // settings() L62: 조회기간 = 올해 1월 1일 ~ 오늘, 검색칸 안내문 "내용/제공처"
  const openValues = useMemo(() => ({ startDate: dayjs().format('YYYY-01-01'), closeDate: dayjs().format(FMT), findText: '' }), [open]);  // eslint-disable-line react-hooks/exhaustive-deps
  const sp = useSearchParams(() => openValues);
  const { startDate, closeDate, findText } = sp.values;
  const [rows, setRows] = useState<IcsDcrPreconfirm[]>([]);
  const [loading, setLoading] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L124-139: companyId, startDate, closeDate, searchText = '%' + 글자 + '%'(서버가 감싼다), statusCode "20"
  const retrieve = useCallback(async (start: string, close: string, text: string) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await icsApi.searchApprovedDcrPreconfirms(start, close, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E0] 화면 열림 (open → show(), retrieve())
  useEffect(() => {
    if (!open) return;
    sp.setValues(openValues);
    setRows([]);
    void retrieve(openValues.startDate, openValues.closeDate, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openValues, retrieve]);

  // confirm() L141-153: 고른 행이 없으면 "선택된 과거심사필번호가 없습니다", 있으면 callback(선택) + hide()
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 과거심사필번호가 없습니다');
      return;
    }
    onResult(row);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="과거심사필번호"
      width={1090}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] confirmButton[확인].Select (L109) / [E5] grid.CellDoubleClick (L121) */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[닫기].Select (L115) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L93) / [E2] retrieveButton[조회].Select (L103) → retrieve() */}
        <SearchBar onSearch={() => retrieve(startDate, closeDate, findText)}>
          <SearchBar.Field label="조회기간">
            <Space size={4}>
              <DatePicker style={{ width: 130 }} allowClear={false} format={FMT} value={dayjs(startDate)}
                onChange={d => d && sp.set('startDate', d.format(FMT))} />
              ~
              <DatePicker style={{ width: 130 }} allowClear={false} format={FMT} value={dayjs(closeDate)}
                onChange={d => d && sp.set('closeDate', d.format(FMT))} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="내용/제공처" value={findText} onChange={e => sp.set('findText', e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsDcrPreconfirm>
            gridRef={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.dcrPreconfirmId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
