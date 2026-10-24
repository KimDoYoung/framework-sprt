/**
 * [1480] 책무 > 02. 책무구조도 > 책무구조도 제출 (N14) — 아래쪽 첨부 목록
 * AS-IS: myApp/client/vi/tdm/Tdm36_TabPage_RoleReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-69: center = 툴바([조회]) + 첨부 목록 SingleGrid(첨부의 종류·내용·보기·문서)
 * [E2 생략] updateButton[상신].Select (L78-83): 본문이 비어 있고 컬럼·툴바에 연결되지 않은 버튼이라 만들지 않는다(도달 불가)
 * 다음 단계: 보기(viewRd·downloadRd — RD 연동 없음, 안내)·문서(ApprCallbackResult·Apr01_Edit_ApprDoc — 전자결재, 안내). 문서 열은 결재상태 30(완료)에만 보이므로 viewFile만 쓰인다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmRoleReport, TdmRoleReportAttach } from '@/types/tdm';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { dynamicIconCell, dynamicViewCell } from './tdmGridCells';

const gb = gbFor<TdmRoleReportAttach>();
const APPR_SENT = ['10', '20', '30'];   // 상신 진행·완료

interface Props {
  /** 위쪽 그리드에서 고른 제출 행 (없으면 비움) */
  roleReport: TdmRoleReport | null;
  /** 같은 행을 다시 눌러도 다시 읽게 하는 값 (AS-IS RowClick마다 retrieve) */
  nonce: number;
}

export const Tdm36_TabPage_RoleReport: React.FC<Props> = ({ roleReport, nonce }) => {
  const [rows, setRows] = useState<TdmRoleReportAttach[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);   // 책무기술서·책무체계도 첨부 보기 (Sys10_Lookup_FileViewer)

  // [E1] retrieveButton[조회].Select (L72) → retrieve() L150-163: tdm.Tdm36_RoleReport.getAttachList(roleReportId)
  //      gridClear() L172-174: 고른 행이 없거나 저장 전이면 목록을 비운다
  const retrieve = useCallback(async () => {
    if (!roleReport || roleReport.roleReportId <= 0) { setRows([]); return; }
    try {
      setRows(await tdmApi.getRoleReportAttaches(roleReport.roleReportId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleReport]);
  // [E0] 화면 열림 (생성자 L55-69) → settings() L71-84, 위쪽 그리드에서 행을 고르면 tabPage.retrieve(고른 행)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [roleReport?.roleReportId, nonce]);

  // viewRd() L276-330 · downloadRd() L332-364: Sys99_Print.CreateTdmRoleDesc → RD 뷰어(Tdm36_Rd_*) / FINES 엑셀 내려받기 — RD 연동이 없어 열 수 없다 (N11~N13과 같다)
  const viewRd = (row: TdmRoleReportAttach) => {
    message.warning(row.rdCode === 'MK_FINES' ? 'RD 연동이 없어 FINES 등록정보를 내려받을 수 없습니다.' : 'RD 뷰어 연동이 없어 열 수 없습니다.');
  };

  // viewFile() L176-274: 책무기술서(ROLE_DESC)는 그 문서(roleReportId)의 첫 첨부, 책무체계도(ROLE_DIGM)는 파일구분 "2"의 첫 파일정보 → 없으면 "1" → 그 첨부. 없으면 "뷰어에러"
  const openFirstFile = async (parentId: number): Promise<boolean> => {
    const files = await fileApi.searchByParentId(parentId);
    if (files.length === 0) return false;
    setViewFile(files[0]);
    return true;
  };
  const openViewFile = async (row: TdmRoleReportAttach) => {
    try {
      let opened = false;
      if (row.rdCode2 === 'ROLE_DESC') {
        opened = await openFirstFile(row.roleReportId);
      } else if (row.rdCode2 === 'ROLE_DIGM') {
        for (const fileType of ['2', '1']) {
          const ids = await tdmApi.getRoleDigmFileIds(row.roleReportId, fileType);
          if (ids.length !== 0) { opened = await openFirstFile(ids[0]); break; }
        }
      } else {
        return;
      }
      if (!opened) message.info('뷰어에러');   // Info.display("", "뷰어에러")
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 문서 (actionCell02 L106-137): 결재상태 10·20·30이면 viewFile(), 아니면 ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval (결재 ID 없으면 "해당문서의 열람권한이 없습니다")
  const viewAppr = (row: TdmRoleReportAttach) => {
    if (row.relateApprStatusCode && APPR_SENT.includes(row.relateApprStatusCode)) { void openViewFile(row); return; }
    // [E생략] ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval: 전자결재는 다른 도메인 — 다음 단계 (문서 열은 결재상태 30에만 보여 이 길은 닿지 않는다)
    message.info('전자결재 문서 보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다');
  };

  // buildGrid() L86-148
  const columnDefs = useMemo(() => [
    gb.text('rptTitle', 300, '첨부의 종류'),  // L142
    gb.text('rptSubTitle', 300, '내용'),  // L143
    dynamicViewCell<TdmRoleReportAttach>('rdCode', 'actionCell01', 60, '보기', viewRd),  // L144 addDynamicCell(rdCode, 60, "보기", actionCell01, true) — rdCode가 있는 행에만
    dynamicIconCell<TdmRoleReportAttach>('view', 'relateApprStatusCode', 'actionCell02', 60, '문서', ['30'], viewAppr),  // L145 addDynamicCell(relateApprStatusCode, 60, "문서", actionCell02, {"30"})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <div style={{ padding: '10px 10px 0' }}>
        {/* [E1] retrieveButton[조회].Select (L72) → retrieve() */}
        <SearchBar onSearch={retrieve} />
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: 10, boxSizing: 'border-box' }}>
        <SingleGrid<TdmRoleReportAttach>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => `${p.data.seq}-${p.data.subSeq}-${p.data.roleReportId}`}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
