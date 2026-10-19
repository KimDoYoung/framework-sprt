# Sys27_Tab_LoginManage

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > 로그인 Mac 주소 관리 (#1442)
- 파일: `client/vi/sys/Sys27_Tab_LoginManage.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectCompanyName` | Sys27_Tab_LoginManage:53 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys27_LoginManage.selectByText` | Sys27_Tab_LoginManage:224 | [`Sys27_LoginManage.java:36`](../../sys/services/Sys27_LoginManage.md) | [`sys27_login_manage.selectByText`](../../sys/sql/sys27_login_manage.md) |
| `sys.Sys27_LoginManage.updateCollapse` | Sys27_Tab_LoginManage:239 | [`Sys27_LoginManage.java:72`](../../sys/services/Sys27_LoginManage.md) | `sys27_login_manage.updateCollapse`(없음) |
| `sys.Sys27_LoginManage.updateConfirmYn` | Sys27_Tab_LoginManage:161 | [`Sys27_LoginManage.java:46`](../../sys/services/Sys27_LoginManage.md) | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md), [`sys27_login_manage.selectById`](../../sys/sql/sys27_login_manage.md), [`sys27_login_manage.updateConfirmYn`](../../sys/sql/sys27_login_manage.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys27_Tab_LoginManage (`client/vi/sys/Sys27_Tab_LoginManage.java`, 254줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 회사명: {companyName} 사원명: {personName} {retrieveButton}
- 입력·하위 화면: `companyName` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - openDateString 200 "신청일" TextCenter
  - companyName 250 "회사명" Text
  - personName 100 "성명" TextCenter
  - placeName 100 "접속구분" TextCenter
  - macAddress 250 "Mac 주소" TextCenter
  - reason 400 "사유" TextArea
  - confirmYn 50 "승인여부" Boolean
  - confirmDateString 200 "승인(취소)일" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L61-93) → settings(), retrieve()
[E1] personName.TriggerClick [result == null] (L103) → 인라인 L103-122 (new TriggerClickHandler(){ @Override …)
[E2] retrieveButton[조회].Select (L124) → retrieve()
[E3] collapseButton[감추기].Select (L130) → collapse()
[E4] grid.getStore().StoreRecordChange [YES] (L136) → 서비스 sys.Sys27_LoginManage.updateConfirmYn(loginManageId, personId, confirmYn), 메시지 "확인"
[E5] msgBox.DialogHide [YES] (L156) → 서비스 sys.Sys27_LoginManage.updateConfirmYn(loginManageId, personId, confirmYn)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L202-230 | 생성자,E2,collapse | 서비스 sys.Sys27_LoginManage.selectByText(companyId, personId) | 업무 |
| private collapse() | L232-249 | E3 | 서비스 sys.Sys27_LoginManage.updateCollapse | 업무 |
| private settings() | L95-185 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 확인창 표시, 서비스 sys.Sys27_LoginManage.updateConfirmYn(loginManageId, personId, confirmYn), 이벤트 연결, 초기값: companyName="전체"("sys.Sys00_Common.selectCompanyName"), personName="전체", personName="전체", personName=empTransInfoModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L187-200 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L251-253 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('openDateString', 200, '신청일'),  // L190 SQL 계산 컬럼(selectByPersonId: TO_CHAR(sys27_open_date, 'YYYY-MM-DD HH…)
  gb.text('companyNm', 250, '회사명'),  // L191 SQL 계산 컬럼(selectByPersonId: sys01_company_nm)
  gb.textCenter('personNm', 100, '성명'),  // L192 SQL 계산 컬럼(selectByPersonId: f_emp_kor_nm(sys27_person_id))
  gb.textCenter('placeNm', 100, '접속구분'),  // L193 SQL 계산 컬럼(selectByPersonId: f_cdnm('LoginPlaceCode', sys27_place_cd…)
  gb.textCenter('macAddress', 250, 'Mac 주소'),  // L194
  gb.textArea('reason', 400, '사유'),  // L195
  gb.boolean('confirmYn', 50, '승인여부'),  // L196
  gb.textCenter('confirmDateString', 200, '승인(취소)일'),  // L197 SQL 계산 컬럼(selectByPersonId: TO_CHAR(sys27_confirm_date, 'YYYY-MM-DD…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="collapse" onClick={collapse}>감추기</Button>

