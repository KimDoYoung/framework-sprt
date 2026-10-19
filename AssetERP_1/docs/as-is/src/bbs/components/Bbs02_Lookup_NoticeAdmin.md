# Bbs02_Lookup_NoticeAdmin

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/bbs/Bbs02_Lookup_NoticeAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs02_Notice.selectByTargetCompany` | Bbs02_Lookup_NoticeAdmin:150 | [`Bbs02_Notice.java:97`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByTargetCompany`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs05_History.updatePersonId` | Bbs02_Lookup_NoticeAdmin:159 | [`Bbs05_History.java:32`](../../bbs/services/Bbs05_History.md) | [`bbs05_history.insert`](../../bbs/sql/bbs05_history.md), [`bbs05_history.selectByNoticeId`](../../bbs/sql/bbs05_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs05_history)` 동적 INSERT/UPDATE → [`bbs05_history.selectById`](../../bbs/sql/bbs05_history.md) |

## 테이블

[`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`bbs05_history`](../../../db/tables/bbs.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Lookup_NoticeAdmin (`client/vi/bbs/Bbs02_Lookup_NoticeAdmin.java`, 195줄)

- 입력·하위 화면: `checkBox` CheckBox, `popup` Bbs02_Popup_NoticeAdmin
- 그리드 `grid` (buildGrid()):
  - topYn 35 "" Pin
  - fromDate 40 "" New
  - title2 630 "공지사항" TextHtml
  - fromDate 90 "등록일" Date
  - actionCell 50 " " Cell 편집:actionCell

#### 이벤트
[E1] checkBox[오늘 하루 이 창을 열지 않음].ValueChange [YES] (L51) → update()
[E2] msgBox.DialogHide [YES] (L65) → update()
[E3] closeButton[닫기].Select (L90) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-105 | 공개 메서드 | 확인창 표시 | 업무 |
| private retrieve() | L144-156 | open,buildGrid | 서비스 bbs.Bbs02_Notice.selectByTargetCompany(companyId, personId) | 업무 |
| private update() | L158-172 | E1,E2 | 서비스 bbs.Bbs05_History.updatePersonId(companyId, personId, noticeId, date) | 업무 |
| private confirm() | L174-176 | E3 | 상태 처리 | 업무 |
| public getServiceResult() | L179-186 | update | 상태 처리 | 업무 |
| private buildGrid() | L107-142 | 필드 초기화 | 팝업 Bbs02_Popup_NoticeAdmin 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L192-194 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L135) addPin
  // ⚠ 대응 없음 (GridBuilder L136) addNew
  // ⚠ 대응 없음 (GridBuilder L137) addTextHtml
  gb.date('fromDate', 90, '등록일'),  // L138
  // ⚠ 대응 없음 (GridBuilder L139) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={confirm}>닫기</Button>

