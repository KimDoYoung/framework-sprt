/**
 * 오후근무 신청 창 (EE72) — 출퇴근 창(Att02_Lookup_Commute)의 [오후근무신청]이 연다
 * AS-IS: myApp/client/vi/att/Att05_Lookup_PmWork.java (484줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-109: 800×300 모달(크기 고정), 머리말 "오후근무 신청", 툴바 50 = [근무일자 ◀ 날짜 ▶][조회][등록][저장][삭제] + 셀 편집 그리드(체크 없음) + [닫기]
 * 그리드 buildGrid L165-211: 근무일자 100 · 사유 450(편집) · 상태 100 · 상신(보기) 80(아이콘). open() L76: retrieve()
 * 상신(보기) 아이콘 L166-202: 변경이 있으면 "저장 후 진행가능합니다" → 상태 10·20·30이면 결재문서 보기, 아니면 insertLinkApproval()(링크코드 A73, 문서분류는 defaultCheck L147의 Dcr30_Link)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AttPmWork } from '@/types/att';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { QuickMoveDateField } from '@/components/form/QuickMoveDateField';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<AttPmWork>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const LINK_CODE = 'A73';
const FMT = 'YYYY-MM-DD';
/** 10 상신 · 20 결재중 · 30 결재완료 */
const locked = (code?: string | null) => code === '10' || code === '20' || code === '30';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Att05_Lookup_PmWork: React.FC<Props> = ({ open, onClose }) => {
  const [baseDate, setBaseDate] = useState(dayjs().format(FMT));  // settings() L113 baseDate.setDate(LoginUser.getToday())
  const [classTreeId, setClassTreeId] = useState<number | null>(null);  // defaultCheck() L147-163: 정확히 1건일 때만
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ pmWorkId: number } | null>(null);
  const linkSaved = useRef(false);
  const crudRef = useRef<ReturnType<typeof useGridCrud<AttPmWork>> | null>(null);
  const baseDateRef = useRef(baseDate);
  baseDateRef.current = baseDate;

  const crud = useGridCrud<AttPmWork>({
    idField: 'pmWorkId',
    // retrieve() L376-389: att.Att05_PmWork.selectByWorkDate(companyId, 내 ID, baseDate)
    search: useCallback(() => attApi.searchPmWorks(baseDateRef.current), []),
    // updateChk01 L267 → 02 L293 → 03 L346 → update L366: 서버가 같은 순서로 검사하고 저장한다. 저장 뒤 다시 조회
    save: useCallback(async (changed: AttPmWork[]) => {
      const ids = new Set(changed.map(r => r.pmWorkId));
      const all = crudRef.current?.rows ?? changed;
      await attApi.savePmWorks({
        baseDate: baseDateRef.current,
        rows: all.map(r => ({ pmWorkId: r.pmWorkId, workDate: r.workDate, reason: r.reason ?? null, changed: ids.has(r.pmWorkId) })),
      });
      return changed;
    }, []),
    remove: useCallback((ids: number[]) => attApi.deletePmWorks(ids), []),
    reloadAfterSave: true,
    // insertRow() L252-265: 신청일자 필수 → 근무일자만 채운 새 행 (companyId·personId는 서버)
    newRow: () => ({ workDate: baseDateRef.current }),
    firstEditField: 'reason',
    deleteConfirm: false,
    // updateChk01 L267-291: 결재 중·완료 수정 불가 → 근무일자 → 사유 (서버도 같은 검사)
    validate: changed => {
      for (const m of changed) {
        if (locked(m.statusCode)) return '결재완료된 항목은 수정이 불가능합니다';
        if (!m.workDate) return '근무일자를 지정해주세요';
        if (m.reason == null || m.reason === '') return '사유를 입력해주세요';
      }
      return undefined;
    },
  });
  crudRef.current = crud;
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L80-109) → settings()(defaultCheck, 오늘), show(). open() L76 → retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs().format(FMT);
    setBaseDate(today);
    baseDateRef.current = today;
    setClassTreeId(null);
    void retrieve();
    dcrApi.searchClassTreeByLinkCode(LINK_CODE)
      .then(list => { if (list.length === 1) setClassTreeId(list[0].classTreeId); })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // updateApprId() L233-250: 상신한 문서 ID를 행에 기록 → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    linkSaved.current = true;
    try {
      await attApi.updatePmWorkAppr(linkDoc.pmWorkId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 기록하지 못했습니다'));
    }
  };

  // 상신(보기) 아이콘 actionCell01 [E7] (L166-202)
  const onAction = (row: AttPmWork) => {
    if (crud.hasChanges() || row.pmWorkId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    if (locked(row.statusCode)) {
      if (row.apprId == null) { message.warning('해당문서의 열람권한이 없습니다'); return; }
      setViewApprId(row.apprId);
      return;
    }
    // insertLinkApproval() L213-231
    if (classTreeId == null) { message.warning('관련 문서분류가 존재하지않습니다. 관리자에게 연락해주세요'); return; }
    linkSaved.current = false;
    setLinkDoc({ pmWorkId: row.pmWorkId });
  };

  // buildGrid() L165-211 (setSortable(false))
  const columnDefs = useMemo(() => [
    gb.date('workDate', 100, '근무일자'),                      // L205
    gb.text('reason', 450, '사유', { editor: 'text' }),        // L206
    gb.textStatus('statusName', 100, '상태'),                  // L207
    iconCell<AttPmWork>('edit', 'actionCell', 80, '상신(보기)', onAction),  // L208
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [classTreeId]);

  // [E5] deleteButton[삭제].Select (L133) → deleteRow() L391-419: 결재 중·완료 안내 → 확인(폭 350) → [E8] YES → delete
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }
    if (locked(selected[0].statusCode)) { message.warning('결재완료된 항목은 삭제불가능합니다'); return; }
    Modal.confirm({
      title: '확인', content: '해당 정보를 삭제하시겠습니까?', width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        const ids = selected.map(r => r.pmWorkId);
        try {
          const persisted = ids.filter(id => id > 0);
          if (persisted.length > 0) await attApi.deletePmWorks(persisted);
          crud.removeRows(ids);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // baseDate(QuickMoveDateField) [E1] callbackOnCreate (L61) → retrieve(). 날짜를 옮기거나 고르면 retrieve
  const onCommit = (v: string) => { baseDateRef.current = v; void retrieve(); };

  return (
    <>
      <LookupModal
        open={open}
        title="오후근무 신청"
        width={800}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E6] closeButton[닫기].Select (L139) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 200, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>근무일자</span>
            <QuickMoveDateField value={baseDate} onChange={setBaseDate} onCommit={onCommit} />
            {/* [E2] retrieveButton[조회].Select (L115) → retrieve() */}
            <Button type="search" onClick={() => retrieve()}>조회</Button>
            {/* [E3] insertButton[등록].Select (L121) → insertRow(): 신청일자가 비면 "신청일자를 지정해주세요" */}
            <Button type="register" onClick={() => { if (!baseDate) { message.warning('신청일자를 지정해주세요'); return; } crud.addRow(); }}>등록</Button>
            {/* [E4] updateButton[저장].Select (L127) → updateChk01() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<AttPmWork> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
          </div>
        </div>
      </LookupModal>
      {/* insertLinkApproval() / retrieveApproval(): Apr01_Edit_ApprDoc */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc && classTreeId != null ? { classTreeId, linkCode: LINK_CODE, refId: linkDoc.pmWorkId } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => { if (linkDoc && !linkSaved.current) void retrieve(); }}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </>
  );
};
