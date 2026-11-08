/**
 * 주간업무구분 관리 창 (Z11) — Rpt03_Lookup_WeekWrite의 [업무구분 설정]에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt05_Lookup_WeekBizClass.java (152줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-66: 모달 "주간업무구분 관리" 500×500, 툴바 50([조회][등록][저장]) + 그리드(행번호, 업무구분 250 · 미사용 80 편집), 아래 가운데 [닫기]
 * [등록]은 코드관리 창(Sys09_Lookup_Code, 코드구분 WeekBizType)을 연다 — 사원이 정하지 않은 구분은 미사용(true)으로 본다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { rptWeekApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptWeekBizClass } from '@/types/rpt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys09_Lookup_Code } from '@/components/lookup/Sys09_Lookup_Code';

const gb = gbFor<RptWeekBizClass>();

interface Props {
  open: boolean;
  /** 저장이 끝났을 때 (AS-IS callback.execute() — 부른 쪽이 업무구분 콤보를 다시 읽는다) */
  onSaved: () => void;
  onClose: () => void;
}

export const Rpt05_Lookup_WeekBizClass: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const [rows, setRows] = useState<RptWeekBizClass[]>([]);
  const [codeOpen, setCodeOpen] = useState(false);
  /** 미사용을 바꾼(GridUpdate 대상) 행 */
  const dirty = useRef<Set<number>>(new Set());

  // retrieve() L109-123: 서비스 rpt.Rpt05_WeekBizClass.selectByPersonId(companyId, personId, stdDate 오늘, kindCode "WeekBizType")
  const retrieve = useCallback(async () => {
    try {
      const list = await rptWeekApi.getBizClasses();
      dirty.current = new Set();
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L41-66, open L68-71) → settings(), show(), retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  // [E2] updateButton[저장].Select (L80) → update() L125-137: rpt.Rpt05_WeekBizClass.upsert → "저장이 완료되었습니다." → retrieve() → callback.execute()
  const update = async () => {
    const changed = rows.filter(r => dirty.current.has(r.weekBizClassId)).map(r => ({ weekBizType: r.weekBizType, unUseYn: r.unUseYn === true }));
    try {
      if (changed.length > 0) await rptWeekApi.saveBizClasses(changed);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('저장이 완료되었습니다.');
    await retrieve();
    onSaved();
  };

  // buildGrid() L100-107
  const columnDefs = useMemo(() => [
    gb.text('weekBizTypeName', 250, '업무구분'),  // L103
    gb.boolean('unUseYn', 80, '미사용', { editable: true }),  // L104
  ], []);

  return (
    <LookupModal
      open={open}
      title="주간업무구분 관리"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] cancelButton[닫기].Select (L92) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L74) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E3] insertButton[등록].Select (L86) → lookupCode() L139-147: Sys09_Lookup_Code.edit("WeekBizType", callback → retrieve()) */}
          <Button type="register" onClick={() => setCodeOpen(true)}>등록</Button>
          <Button type="save" onClick={update}>저장</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<RptWeekBizClass>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.weekBizClassId)}
            onCellValueChanged={e => { if (e.colDef.field === 'unUseYn' && e.data) dirty.current.add(e.data.weekBizClassId); }}
          />
        </div>
      </div>
      <Sys09_Lookup_Code open={codeOpen} codeKind="WeekBizType" onResult={() => { void retrieve(); }} onClose={() => { setCodeOpen(false); void retrieve(); }} />
    </LookupModal>
  );
};
