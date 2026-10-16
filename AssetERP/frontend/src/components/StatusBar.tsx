import React, { useState, useEffect } from 'react';
import { Tooltip, Popover, Modal, Button, Tag, Space, Divider, message } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  SoundOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  WifiOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface StatusMessage {
  id: string;
  type: 'notice' | 'update' | 'info' | 'warning';
  tag: string;
  tagColor: string;
  text: string;
  timestamp: string;
  detail?: string;
}

const statusMessages: StatusMessage[] = [
  {
    id: '1',
    type: 'notice',
    tag: '시스템',
    tagColor: 'blue',
    text: 'Asset-ERP 서버 및 인프라 서비스가 모두 정상 운영 중입니다.',
    timestamp: '16:00',
    detail: '모든 마이크로서비스 및 메인 데이터베이스(DB), 캐시 클러스터와의 지연 시간이 정상 범위를 유지하고 있습니다.',
  },
  {
    id: '2',
    type: 'update',
    tag: '업데이트',
    tagColor: 'green',
    text: 'FlexLayout 기반 멀티 윈도우 분할 탭 및 레이아웃 자동 저장 기능이 활성화되었습니다.',
    timestamp: '15:30',
    detail: '탭 헤더를 상/하/좌/우로 드래그하여 패널을 무제한 분할할 수 있으며, 탭이 0개가 된 패널은 자동으로 정리됩니다.',
  },
  {
    id: '3',
    type: 'info',
    tag: '결재안내',
    tagColor: 'orange',
    text: '결재 대기 중인 문서가 2건 있습니다. MyPage 결재함을 확인하세요.',
    timestamp: '14:15',
    detail: '정기 승인 및 컴플라이언스 준수 승인 요청 건이 도착해 있습니다.',
  },
  {
    id: '4',
    type: 'warning',
    tag: '점검예정',
    tagColor: 'volcano',
    text: '정기 보안 패치 및 데이터 무결성 검증 작업이 토요일 02:00에 예정되어 있습니다.',
    timestamp: '10:00',
    detail: '작업 중 약 5분간 간헐적 접속 지연이 발생할 수 있습니다.',
  },
];

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export const StatusBar: React.FC = () => {
  // ── 실시간 시계 상태 ──
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());
  const [sessionSeconds, setSessionSeconds] = useState<number>(3540); // 59분

  // ── 메시지 티커 상태 ──
  const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // ── 시스템 헬스 새로고침 상태 ──
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('방금 전');
  const [latency, setLatency] = useState<number>(14);

  // 1초마다 시계 업데이트 및 세션 감소
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 5초마다 중앙 메시지 순환
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % statusMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // 세션 연장 처리
  const handleExtendSession = () => {
    setSessionSeconds(3600);
    message.success('로그인 세션이 60분 연장되었습니다.');
  };

  // 헬스체크 새로고침 시뮬레이션
  const handleRefreshHealth = () => {
    setIsCheckingHealth(true);
    setTimeout(() => {
      setIsCheckingHealth(false);
      setLatency(Math.floor(Math.random() * 8) + 11);
      setLastCheckedTime(dayjs().format('HH:mm:ss'));
      message.success('시스템 헬스 상태가 정상 확인되었습니다.');
    }, 600);
  };

  const currentMsg = statusMessages[currentMsgIndex];
  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const sessionRemSec = sessionSeconds % 60;

  // ── 왼쪽 시스템 헬스 Popover 컨텐츠 ──
  const healthPopoverContent = (
    <div style={{ width: 280, fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 14 }} />
          <span>전체 시스템 정상 가동 중</span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<SyncOutlined spin={isCheckingHealth} />}
          onClick={handleRefreshHealth}
          style={{ fontSize: 11, padding: '0 4px', height: 22 }}
        >
          재점검
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#475569' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CloudServerOutlined style={{ color: '#1677ff' }} /> API Gateway
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            200 OK ({latency}ms)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DatabaseOutlined style={{ color: '#722ed1' }} /> Main Database
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            Connected (Pool: 8/20)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <WifiOutlined style={{ color: '#13c2c2' }} /> EventBus / Push
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            Active (Live)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DashboardOutlined style={{ color: '#fa8c16' }} /> Server CPU / Mem
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>16% / 32% (안정)</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <SafetyCertificateOutlined style={{ color: '#52c41a' }} /> 보안 컴플라이언스
          </span>
          <span style={{ fontSize: 11, color: '#52c41a', fontWeight: 600 }}>정상 (0건 위반)</span>
        </div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
        <span>마지막 점검: {lastCheckedTime}</span>
        <span>Version 2.4.0</span>
      </div>
    </div>
  );

  return (
    <>
      <footer
        style={{
          height: 28,
          backgroundColor: '#151a24',
          borderTop: '1px solid #222938',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          color: '#94a3b8',
          fontSize: 11,
          fontFamily: 'var(--app-font-family)',
          userSelect: 'none',
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        {/* ── 1. 왼쪽: System Health (시스템 헬스 상태) ── */}
        <Popover content={healthPopoverContent} title={null} trigger="hover" placement="topLeft">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 3,
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2736')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* Pulsing Green Indicator */}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#52c41a',
                display: 'inline-block',
                boxShadow: '0 0 6px #52c41a',
              }}
            />
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 11 }}>
              System Healthy
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CloudServerOutlined style={{ fontSize: 11 }} />
              API {latency}ms
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 3 }}>
              <DatabaseOutlined style={{ fontSize: 11 }} />
              DB OK
            </span>
          </div>
        </Popover>

        {/* ── 2. 중앙: 메세지 (시스템 공지 및 상태 알림) ── */}
        <div
          style={{
            flex: 1,
            maxWidth: 680,
            margin: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: 3,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            setIsPaused(true);
            e.currentTarget.style.backgroundColor = '#1f2736';
          }}
          onMouseLeave={(e) => {
            setIsPaused(false);
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => setModalOpen(true)}
          title="클릭하여 전체 시스템 공지 및 메시지 확인"
        >
          <SoundOutlined style={{ color: '#fbbf24', fontSize: 12, marginRight: 6, flexShrink: 0 }} />
          <Tag
            color={currentMsg.tagColor}
            style={{
              fontSize: 10,
              lineHeight: '16px',
              padding: '0 4px',
              marginRight: 6,
              borderRadius: 2,
              border: 'none',
              flexShrink: 0,
            }}
          >
            {currentMsg.tag}
          </Tag>
          <span
            style={{
              color: '#cbd5e1',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 11,
              transition: 'opacity 0.2s',
            }}
          >
            {currentMsg.text}
          </span>
          <span style={{ color: '#64748b', fontSize: 10, marginLeft: 6, flexShrink: 0 }}>
            ({currentMsgIndex + 1}/{statusMessages.length})
          </span>
        </div>

        {/* ── 3. 오른쪽: Clock (실시간 시계 및 세션) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tooltip title={`세션 남은 시간: ${sessionMinutes}분 ${sessionRemSec}초 (클릭하여 연장)`}>
            <span
              onClick={handleExtendSession}
              style={{
                color: sessionMinutes < 10 ? '#f87171' : '#94a3b8',
                fontSize: 11,
                cursor: 'pointer',
                padding: '2px 5px',
                borderRadius: 3,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2736')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              세션 {sessionMinutes}m
            </span>
          </Tooltip>

          <span style={{ color: '#334155' }}>|</span>

          <Tooltip title="대한민국 표준시 (KST, UTC+09:00)">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: '#f1f5f9',
                fontWeight: 500,
                fontSize: 11,
                padding: '2px 4px',
              }}
            >
              <ClockCircleOutlined style={{ color: '#38bdf8', fontSize: 12 }} />
              <span>
                {currentTime.format('YYYY-MM-DD')} ({dayNames[currentTime.day()]}){' '}
                <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentTime.format('HH:mm:ss')}</strong>
              </span>
              <Tag
                color="blue"
                style={{
                  margin: '0 0 0 4px',
                  fontSize: 9,
                  lineHeight: '14px',
                  padding: '0 3px',
                  borderRadius: 2,
                  border: 'none',
                }}
              >
                KST
              </Tag>
            </div>
          </Tooltip>
        </div>
      </footer>

      {/* ── 전체 시스템 메시지 및 공지사항 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HistoryOutlined style={{ color: '#1677ff' }} />
            <span>시스템 알림 및 공지사항 전체 내역</span>
          </div>
        }
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalOpen(false)}>
            확인
          </Button>,
        ]}
        width={580}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {statusMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Space size={6}>
                  <Tag color={msg.tagColor} style={{ margin: 0, fontSize: 11 }}>
                    {msg.tag}
                  </Tag>
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{msg.text}</span>
                </Space>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{msg.timestamp}</span>
              </div>
              {msg.detail && (
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                  {msg.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
