/**
 * 인사정보 가져오기 창 (N04) — 임원 등록의 [인사정보 가져오기]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm01_Lookup_HrChangeInfo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1380×600(원본) → 그대로 1380: 툴바([조회]) + 변동 전/후 비교 그리드(SingleGrid, 묶음 헤더 2개) + [적용][닫기]
 * UX보강(10): 조회창(UX-05·06)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Space, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmHrChange } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TdmHrChange>();
const BEF = '#0069B4';   // setHtmlGridStyle(…, "0069B4")
const AFT = '#085820';   // setHtmlGridStyle(…, "085820")

const color = (c: string) => ({ headerStyle: { color: c } });
/** 묶음 헤더 제목을 색 글자로 (AS-IS setHtmlGridStyle) */
const coloredGroup = (title: string, c: string, children: Parameters<typeof gb.group>[1]) => ({
  ...gb.group(title, children),
  headerGroupComponent: () => <b style={{ color: c }}>{title}</b>,
});

/** buildGrid() L102-125 */
const buildGrid = () => [
  gb.textCenter('changeTypeName', 50, '구분'),  // L109
  gb.textCenter('personName', 80, '임원명'),  // L110
  coloredGroup('변동 전', BEF, [   // L106 HeaderGroupMap(0, 3, …, 1, 6)
    gb.text('befPosName', 80, '직위', color(BEF)),  // L111
    gb.text('befTitleName', 80, '직책', color(BEF)),  // L112
    gb.text('befOrgName', 150, '조직명', color(BEF)),  // L113
    gb.date('befHireDate', 90, '입사일', color(BEF)),  // L114
    gb.date('befRetireDate', 90, '퇴사일', color(BEF)),  // L115
    gb.date('befEndDate', 90, '책무대상<br>종료일', color(BEF)),  // L116
  ]),
  coloredGroup('변동 후', AFT, [   // L107 HeaderGroupMap(0, 9, …, 1, 6)
    gb.text('aftPosName', 80, '직위', color(AFT)),  // L117
    gb.text('aftTitleName', 80, '직책', color(AFT)),  // L118
    gb.text('aftOrgName', 150, '조직명', color(AFT)),  // L119
    gb.date('aftHireDate', 90, '입사일', color(AFT)),  // L120
    gb.date('aftRetireDate', 90, '퇴사일', color(AFT)),  // L121
    gb.date('aftEndDate', 90, '책무대상<br>종료일', color(AFT)),  // L122
  ]),
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute() — 적용에 성공한 뒤 (부르는 쪽이 다시 조회). 닫기는 onClose */
  onApplied: () => void;
  onClose: () => void;
}

export const Tdm01_Lookup_HrChangeInfo: React.FC<Props> = ({ open, onApplied, onClose }) => {
  const [rows, setRows] = useState<TdmHrChange[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L127-138: tdm.Tdm01_Hr.selectPersonModifyed (companyId는 서버)
  const retrieve = async () => {
    try {
      setRows(await tdmApi.searchHrChanges());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L55-79) → settings(), show() / open(callback) → retrieve() L50-53
  useEffect(() => { if (open) void retrieve(); }, [open]);

  // [E2] updateButton[적용].Select (L88) → preUpdate() L140-157: 내역이 없으면 안내, 있으면 확인 후 update()
  const preUpdate = () => {
    if (rows.length === 0) {
      message.warning('변동된 내역이 없습니다');
      return;
    }
    // [E4] messageBox.DialogHide (L147) YES → update()
    Modal.confirm({
      title: '확인',
      content: '변동 후 인사정보를 적용하시겠습니까?',
      width: 350,
      onOk: update,
    });
  };

  // update() L159-186: tdm.Tdm01_Hr.updateHrInfo (companyId·updName은 서버, 목록 전체)
  const update = async () => {
    try {
      await tdmApi.applyHrChanges(rows.map(r => ({
        personId: r.personId, changeTypeCode: r.changeTypeCode, befEndDate: r.befEndDate, aftEndDate: r.aftEndDate,
      })));
    } catch (err) {
      message.error(errorMessage(err, '적용 실패'));
      return;
    }
    message.success('인사정보가 적용되었습니다.');
    onApplied();
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="인사정보 가져오기"
      width={1380}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={preUpdate}>적용</Button>
            {/* [E3] closeButton[닫기].Select (L94) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 430, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          {/* [E1] retrieveButton[조회].Select (L82) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TdmHrChange> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.hrId)} />
        </div>
      </div>
    </LookupModal>
  );
};
