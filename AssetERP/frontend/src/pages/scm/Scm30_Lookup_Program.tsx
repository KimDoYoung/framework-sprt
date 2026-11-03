/**
 * 프로그램 Version 조회창 (EE19) — Scm30_Tab_Program 그리드의 버전 옆 [View] 아이콘이 연다 (한 프로그램의 모든 버전)
 * AS-IS: myApp/client/vi/scm/Scm30_Lookup_Program.java (207줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(tabGrid, programModel, callback) L47-58: "프로그램 Version", 시스템·구분(이름)·프로그램ID는 읽기 전용 글상자, 열면 바로 조회
 * retrieve() L159-198: scm.Scm30_Program.selectBySystemCode(companyId, systemCode, programType, programCode)
 * buildGrid() L109-157: 프로그램명 350 · 등록자 100 · 등록일시 150 · 배포일시 150 · 버전 40 · 소스보기 70(View) · 파일다운 70(Down) · 비고 330 · 사용여부 70, 행번호 있음, 단일 선택
 * [E2] sourceViewCell (L120) → Scm30_Edit_Program.versionEdit(lastVersion, grid, tabGrid, selectModel, callback) — 행 수 == 선택 행의 버전이면 lastVersion(탭 그리드도 같이 갱신)
 * [E1] closeButton[닫기].Select (L98) → hide()
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { scmApi } from '@/api/scm';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Program, ProgramVersion } from '@/types/scm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Scm30_Edit_Program } from './Scm30_Edit_Program';

const gb = gbFor<ProgramVersion>();
const LABEL: React.CSSProperties = { flex: 'none', fontSize: 12, marginRight: 6 };

interface Props {
  open: boolean;
  /** open(tabGrid, programModel, callback) — 탭 그리드에서 고른 프로그램 */
  program: Program | null;
  /** 마지막 버전을 고쳐 저장했을 때 탭 그리드를 다시 읽는다 (AS-IS tabGrid.getStore().update) */
  onTabChanged: () => void;
  onClose: () => void;
}

export const Scm30_Lookup_Program: React.FC<Props> = ({ open, program, onTabChanged, onClose }) => {
  const [rows, setRows] = useState<ProgramVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<{ row: ProgramVersion; last: boolean } | null>(null);

  // retrieve() L159-198
  const retrieve = async () => {
    if (!program) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await scmApi.searchProgramVersions({
        systemCode: program.systemCd || '%', programType: program.programType || '%', programCode: program.programCd || '%',
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L60-89) → settings(), show() + open() L47-58 → retrieve()
  useEffect(() => {
    if (open) void retrieve();
    else setRows([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, program]);

  // buildGrid() L109-157
  const columnDefs = useMemo(() => [
    gb.text('programNm', 350, '프로그램명'),                                                     // L146
    gb.text('personNm', 100, '등록자'),                                                           // L147
    gb.text('regDateStr', 150, '등록일시'),                                                       // L148
    gb.text('deployDateStr', 150, '배포일시'),                                                    // L149
    gb.long('version', 40, '버전'),                                                               // L150
    // [E2] sourceViewCell (L110-126): 행 수 == 버전이면 lastVersion
    iconCell<ProgramVersion>('view', 'sourceViewCell', 70, '소스보기', row => setEditTarget({ row, last: rows.length === row.version })),  // L151
    // downloadCell (L128-141): FileDownload?fileType=file&fileId
    iconCell<ProgramVersion>('down', 'downloadCell', 70, '파일다운', row => {                    // L152
      if (row.fileId == null) return;
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    gb.text('note', 330, '비고'),                                                                 // L153
    gb.text('useYn', 70, '사용여부', { valueFormatter: p => (p.value === 'true' ? '사용' : '미사용') }),  // L154 addBooleanString = "사용"/"미사용" 글자
  ], [rows.length]);

  return (
    <>
      <LookupModal
        open={open}
        title="프로그램 Version"
        width={1260}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select (L98) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>시스템:</span>
            <Input readOnly style={{ width: 120 }} value={program?.systemNm ?? ''} />
            <span style={{ ...LABEL, marginLeft: 16 }}>구분:</span>
            <Input readOnly style={{ width: 120 }} value={program?.programTypeNm ?? ''} />
            <span style={{ ...LABEL, marginLeft: 16 }}>프로그램ID:</span>
            <Input readOnly style={{ width: 300 }} value={program?.programCd ?? ''} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<ProgramVersion>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.programId)}
              loading={loading}
            />
          </div>
        </div>
      </LookupModal>
      {/* Scm30_Edit_Program.versionEdit — 저장하면 이 조회창을 다시 읽고, 마지막 버전이면 탭 그리드도 다시 읽는다 */}
      <Scm30_Edit_Program
        open={editTarget != null}
        mode="versionEdit"
        program={editTarget?.row ?? null}
        onSaved={() => { void retrieve(); if (editTarget?.last) onTabChanged(); }}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
};
