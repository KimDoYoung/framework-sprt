# Sys91_Tab_AdviceMember

- 종류: 화면
- 메뉴: 커뮤니티 > 91. AssetERP > AssetERP 자문위원 (#1301)
- 메뉴: 관리자 > 09. 기타 > AssetERP 자문의원 관리 (#1302)
- 파일: `client/vi/sys/Sys91_Tab_AdviceMember.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys91_AdviceMember.delete` | Sys91_Tab_AdviceMember:186 | [`Sys91_AdviceMember.java:33`](../../sys/services/Sys91_AdviceMember.md) | `UpdateDataModel(sys91_advice_member)` 동적 DELETE |
| `sys.Sys91_AdviceMember.selectByAll` | Sys91_Tab_AdviceMember:140 | [`Sys91_AdviceMember.java:22`](../../sys/services/Sys91_AdviceMember.md) | [`sys91_advice_member.selectByAll`](../../sys/sql/sys91_advice_member.md) |
| `sys.Sys91_AdviceMember.update` | Sys91_Tab_AdviceMember:151 | [`Sys91_AdviceMember.java:28`](../../sys/services/Sys91_AdviceMember.md) | `UpdateDataModel(sys91_advice_member)` 동적 INSERT/UPDATE → [`sys91_advice_member.selectById`](../../sys/sql/sys91_advice_member.md) |

## 테이블

[`sys91_advice_member`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys91_Tab_AdviceMember (`client/vi/sys/Sys91_Tab_AdviceMember.java`, 188줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - field 100 "분야" TextCenter 편집:TextField
  - companyName 150 "회사명" TextCenter 편집:TextField
  - memberName 150 "대표" TextCenter 편집:TextField
  - career 300 "약력" TextArea 편집:MyTextArea
  - homepage 250 "홈페이지" Text 편집:TextField
  - telno 200 "상담전화" Text 편집:TextField
  - email 200 "이메일" Text 편집:TextField
  - address 300 "주소" TextArea 편집:MyTextArea
  - note 300 "비고" TextArea 편집:MyTextArea
  - field 100 "분야" TextCenter
  - companyName 150 "회사명" TextCenter
  - memberName 150 "대표" TextCenter
  - career 300 "약력" TextArea
  - homepage 250 "홈페이지" TextLink
  - telno 200 "상담전화" Text
  - email 200 "이메일" Text
  - address 300 "주소" TextArea
  - note 300 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L44-67) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L70) → retrieve()
[E2] insertButton[등록].Select (L76) → insertRow()
[E3] updateButton[저장].Select (L82) → update()
[E4] deleteButton[삭제].Select (L88) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L165) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L137-146 | 생성자,E1 | 서비스 sys.Sys91_AdviceMember.selectByAll | 업무 |
| public update() | L149-152 | E3 | 서비스 sys.Sys91_AdviceMember.update | 업무 |
| public insertRow() | L155-160 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L162-180 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L183-187 | E5 | GridDeleteData sys.Sys91_AdviceMember.delete(체크된 행 목록) | 업무 |
| private settings() | L69-106 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L108-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('field', 100, '분야', { editor: 'text' }),  // L112
  gb.textCenter('companyNm', 150, '회사명', { editor: 'text' }),  // L113
  gb.textCenter('memberNm', 150, '대표', { editor: 'text' }),  // L114
  gb.textArea('career', 300, '약력', { editor: 'largeText' }),  // L115
  gb.text('homepage', 250, '홈페이지', { editor: 'text' }),  // L116
  gb.text('telno', 200, '상담전화', { editor: 'text' }),  // L117
  gb.text('email', 200, '이메일', { editor: 'text' }),  // L118
  gb.textArea('address', 300, '주소', { editor: 'largeText' }),  // L119
  gb.textArea('note', 300, '비고', { editor: 'largeText' }),  // L120
  gb.textCenter('field', 100, '분야'),  // L122
  gb.textCenter('companyNm', 150, '회사명'),  // L123
  gb.textCenter('memberNm', 150, '대표'),  // L124
  gb.textArea('career', 300, '약력'),  // L125
  // ⚠ 대응 없음 (GridBuilder L126) addTextLink
  gb.text('telno', 200, '상담전화'),  // L127
  gb.text('email', 200, '이메일'),  // L128
  gb.textArea('address', 300, '주소'),  // L129
  gb.textArea('note', 300, '비고'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

