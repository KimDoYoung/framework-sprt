/**
 * MyPage 현황판 (임직원 현황, 오른쪽 접이식 패널)
 * AS-IS: myApp/client/vi/frm/Monitoring_Page_Emp.java (204줄, TabBorder 동쪽) + 셀 클릭 창 emp/Emp00_Popup_Emp.java (85줄)
 * 생성자 L50-152: 그리드(사진 65 · 이름 직위 100 · 상태 아이콘 40, 행번호 없음) + 아래 줄 [상태 아이콘 3개(툴팁 "상태 Tip")][사원/부서명 검색][새로고침]
 * 접기/펼치기는 TOBE 목업의 모양(사용자 설계)을 그대로 둔다. 그리드는 한 사람 한 줄의 목록으로 그린다(편집·정렬 없음)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button as AntButton, Input, Tooltip, message } from 'antd';
import { LeftOutlined, ReloadOutlined, RightOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { frmApi } from '@/api/frm';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import type { FrmMonitorEmp } from '@/types/frm';
import { useAppSetting } from '@/hooks/useAppSetting';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface EmployeePanelProps {
  /** 값이 바뀌면 다시 조회 (AS-IS Calendar.allRetrieve → empGrid.retrieve()) */
  refreshKey?: number;
}

/** GridBuilder.addLocation L2428-2467: 상태 코드 → 아이콘 (없으면 red) */
const LOCATION_ICON: Record<string, string> = {
  '10': 'green', '20': 'red', '30': 'gray', '11': 'gray_green', '12': 'gray_red', '21': 'green_gray', '22': 'red_gray',
  '31': 'large_gray_green', '32': 'large_gray_red', '33': 'green_large_gray', '34': 'red_large_gray',
  '35': 'green_small_gray', '36': 'red_small_gray', '37': 'small_gray_green', '38': 'small_gray_red',
};
/** AS-IS ./img/icon/leave/*.png (frontend/public/img/icon/leave 로 복사) */
const iconSrc = (name: string) => `./img/icon/leave/${name}.png`;
const locationSrc = (code: string | null) => iconSrc(LOCATION_ICON[code ?? ''] ?? 'red');

export const EmployeePanel: React.FC<EmployeePanelProps> = ({ refreshKey = 0 }) => {
  const [collapsed, setCollapsed] = useAppSetting('mypage_employee_collapsed', false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FrmMonitorEmp[]>([]);
  const [popup, setPopup] = useState<FrmMonitorEmp | null>(null);

  // retrieve() L184-203: emp.Emp03_Trans.MonitoringByText(companyId, transDate=오늘, searchText="%"+값+"%")
  const retrieve = useCallback(async (text: string) => {
    try { setRows(await frmApi.searchMonitorEmps(text.trim() || undefined)); }
    catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  // [E0] 화면 열림 (생성자 L50-152) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(searchText); }, [retrieve, refreshKey]);

  if (collapsed) {
    return (
      <div
        onClick={() => setCollapsed(false)}
        title="임직원 현황 펼치기"
        style={{
          width: 24, backgroundColor: '#f1f5f9', borderLeft: '1px solid #d9dfe8', display: 'flex', flexDirection: 'column',
          alignItems: 'center', height: '100%', flexShrink: 0, cursor: 'pointer', padding: '8px 0', userSelect: 'none', boxSizing: 'border-box',
        }}
      >
        <AntButton type="text" size="small" icon={<LeftOutlined style={{ fontSize: 10, color: '#1677ff' }} />} style={{ width: 20, height: 20, padding: 0, marginBottom: 8 }} />
        <TeamOutlined style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }} />
        <div style={{ writingMode: 'vertical-rl', letterSpacing: 2, fontSize: 11, fontWeight: 600, color: '#475569' }}>임직원 ({rows.length})</div>
      </div>
    );
  }

  return (
    <div style={{ width: 190, backgroundColor: '#f8fafc', borderLeft: '1px solid #d9dfe8', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafbfc', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TeamOutlined style={{ color: '#1677ff', fontSize: 13 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>임직원 현황</span>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>({rows.length}명)</span>
        </div>
        <Tooltip title="임직원 현황 접기" placement="left">
          <AntButton type="text" size="small" icon={<RightOutlined style={{ fontSize: 10, color: '#64748b' }} />} onClick={() => setCollapsed(true)} style={{ width: 20, height: 20, padding: 0 }} />
        </Tooltip>
      </div>

      {/* buildGrid L172-182: 사진(EmpImageCell: FileDownload?fileType=monitoring + info 아이콘) · monitoringName(HTML) · addLocation */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '6px 8px' }}>
        {rows.map(emp => (
          <div
            key={emp.personId}
            // [E3] grid.CellClick (L137) → Emp00_Popup_Emp.open(이름, 사번, 상위부서 전체명, 이메일, 휴대폰, 사무실, 내선, 현상태)
            onClick={() => setPopup(emp)}
            className="mypage-emp-row"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', margin: '3px 0', borderRadius: 6, backgroundColor: '#fff', border: '1px solid #eef2f7', cursor: 'pointer' }}
          >
            <Avatar size={30} src={fileApi.monitoringUrl(emp.personId)} icon={<UserOutlined />} style={{ flexShrink: 0, backgroundColor: '#94a3b8' }} />
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {emp.monitoringName}
            </div>
            <img src={locationSrc(emp.locationCode)} alt="" style={{ width: 13, height: 13, borderRadius: '70%', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* bar01 L88-93: 상태 아이콘 3개 + 툴팁 "상태 Tip"(온라인·오프라인·휴가) — 누름 동작 없음 */}
        <Tooltip
          placement="top"
          title={<div><b>상태 Tip</b><div>
            <img src={iconSrc('green')} alt="" style={{ width: 10 }} /> 온라인{' '}
            <img src={iconSrc('red')} alt="" style={{ width: 10 }} /> 오프라인{' '}
            <img src={iconSrc('gray')} alt="" style={{ width: 10 }} /> 휴가
          </div></div>}
        >
          <span style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
            {['green', 'red', 'gray'].map(n => <img key={n} src={iconSrc(n)} alt="" style={{ width: 11, height: 11 }} />)}
          </span>
        </Tooltip>
        {/* [E2] searchText.KeyPress[Enter] (L102) → retrieve() */}
        <Input
          placeholder="사원/부서명 검색"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={() => void retrieve(searchText)}
          size="small"
          style={{ fontSize: 11, borderRadius: 40 }}
        />
        {/* [E1] anchor04(새로고침).MouseDown (L66) → retrieve() */}
        <Tooltip title="새로고침" placement="left">
          <ReloadOutlined style={{ fontSize: 13, color: '#64748b', cursor: 'pointer', flexShrink: 0 }} onClick={() => void retrieve(searchText)} />
        </Tooltip>
      </div>

      {/* Emp00_Popup_Emp L26-76: 400×280, 머리말 "이름 직위 (사번)", ᛫ 부서명 · 이메일 · 사무실 / 내선(없으면 "미입력") · 현상태, [닫기] (휴대폰 줄은 AS-IS 주석) */}
      <LookupModal
        open={popup != null}
        title={popup ? `${popup.monitoringName} (${popup.empNo ?? ''})` : ''}
        width={400}
        onCancel={() => setPopup(null)}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={() => setPopup(null)}>닫기</Button></div>}
      >
        {popup && (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <div>᛫ 부서명 : {popup.parentFullName ?? ''}</div>
            <div>᛫ 이메일 : {popup.emailAddress ?? ''}</div>
            <div>᛫ 사무실 : {popup.officeTelNo ?? '미입력'}&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;내 선 : {popup.officeDetail ?? '미입력'}</div>
            <div>᛫ 현상태 : {popup.locationName ?? ''}</div>
          </div>
        )}
      </LookupModal>
    </div>
  );
};

export const RightMessengerSidebar = EmployeePanel;
