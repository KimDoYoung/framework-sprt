/**
 * 배포처리 아래쪽 페이지 (EE18) — Scm13_Tab_Deploy의 위 목록에서 고른 개발의 배포 대상 프로그램
 * AS-IS: myApp/client/vi/scm/Scm13_Page_Deploy.java (200줄) + Scm13_Lookup_Note(94줄) + Scm30_Edit_Program(465줄, read 모드만) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L48-64: 위 [배포처리] 막대 50 + 아래 그리드(체크 다중 선택) 8열
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import type { Deploy, DeployProgram } from '@/types/scm';
import { Scm13_Lookup_Note } from './Scm13_Lookup_Note';
import { Scm30_Edit_Program } from './Scm30_Edit_Program';

const gb = gbFor<DeployProgram>();

interface Props {
  /** retrieve(selectModel, callback) — 위 목록에서 고른 줄. null이면 비운다 */
  dev: Deploy | null;
  /** 위 목록을 조회할 때마다 올라간다 — 같은 줄이어도 다시 읽는다(retrievePage) */
  reloadKey: number;
  /** callback.execute() — 모든 대상이 배포돼 배포 단계가 끝난 뒤 (위 목록 다시 조회) */
  onCompleted: () => void;
}

export const Scm13_Page_Deploy: React.FC<Props> = ({ dev, reloadKey, onCompleted }) => {
  // [E0] 화면 열림 (생성자 L48-64) → 초기화
  const [rows, setRows] = useState<DeployProgram[]>([]);
  const [checked, setChecked] = useState<DeployProgram[]>([]);
  const [sourceTarget, setSourceTarget] = useState<DeployProgram | null>(null);
  const [noteTarget, setNoteTarget] = useState<DeployProgram | null>(null);

  // retrieve(Boolean deployYn) L117-128: scm.Scm13_DevProgram.selectByDeployTgtDevId(devId) → deployYn 이면 deployComplete()
  const retrieve = useCallback(async (deployYn: boolean) => {
    if (!dev) { setRows([]); setChecked([]); return; }
    try {
      const list = await scmApi.searchDeployPrograms(dev.devId);
      setRows(list);
      setChecked([]);
      if (deployYn) await deployComplete(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev?.devId, reloadKey]);

  useEffect(() => { void retrieve(false); }, [retrieve]);

  // deployComplete() L181-199: 배포일시가 빈 줄이 하나라도 있으면 그만, 모두 배포됐으면 scm.Scm13_DevProgram.updateResultDeploy(devId) → callback.execute()
  const deployComplete = async (list: DeployProgram[]) => {
    if (!dev || list.some(r => r.deployDateStr == null)) return;
    await scmApi.completeDeploy(dev.devId);
    onCompleted();
  };

  // [E1] deployButton[배포처리].Select (L55) → deploy() L130-179
  const deploy = () => {
    if (checked.length === 0) { message.warning('선택된 프로그램이 없습니다'); return; }
    if (checked.some(r => r.deployDate != null)) { message.warning('이미 배포처리된 대상입니다.'); return; }
    // HtmlMessageBox("배포", "N건의 항목을 배포하시겠습니까?") 폭 330, YES → updateDeploy → retrieve(true)  [E4] msgBox.DialogHide [YES] (L153)
    Modal.confirm({
      title: '배포', content: `${checked.length}건의 항목을 배포하시겠습니까?`, width: 330, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await scmApi.deployPrograms(checked.map(r => r.devProgramId as number));
          await retrieve(true);
        } catch (err) {
          message.error(errorMessage(err, '배포 실패'));
        }
      },
    });
  };

  // buildGrid() L66-108
  const columnDefs = useMemo(() => [
    gb.long('deploySeq', 80, '배포순서'),                                                  // L98
    gb.text('programTypeNm', 100, '구분'),                                                 // L99
    gb.text('programCd', 250, '프로그램ID'),                                               // L100
    gb.text('programNm', 350, '프로그램명'),                                               // L101
    gb.text('personNm', 100, '개발자'),                                                    // L102
    // [E2] sourceViewCell (ImageCell).callbackOnCreate (L73) → Scm30_Edit_Program.read(programModel, callback)
    iconCell<DeployProgram>('view', 'sourceViewCell', 80, '소스보기', setSourceTarget),    // L103
    gb.text('deployDateStr', 150, '배포일시'),                                             // L104
    // [E3] noteCell (ImageCell).callbackOnCreate (L87) → Scm13_Lookup_Note.open(selectModel, callback: retrieve(false))
    iconCell<DeployProgram>('edit', 'noteCell', 80, '비고', setNoteTarget),                // L105
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>  {/* deployPage.setBorders(true) (Tab L101) */}
      <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
        <Button type="save" onClick={deploy}>배포처리</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<DeployProgram>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.devProgramId)}
          onCheckedChange={setChecked}
        />
      </div>
      <Scm30_Edit_Program open={sourceTarget != null} program={sourceTarget} onClose={() => setSourceTarget(null)} />
      <Scm13_Lookup_Note open={noteTarget != null} program={noteTarget} onSaved={() => void retrieve(false)} onClose={() => setNoteTarget(null)} />
    </div>
  );
};
