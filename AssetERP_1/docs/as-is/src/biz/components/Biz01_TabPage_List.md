# Biz01_TabPage_List

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bmt`
- 파일: `client/vi/biz/Biz01_TabPage_List.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Crm09_Lookup_SelectSingle`](../../crm/components/Crm09_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.delete` | Biz01_TabPage_List:232 | [`Biz01_Promo.java:669`](../../biz/services/Biz01_Promo.md) | [`biz02_person.delete`](../../biz/sql/biz02_person.md), `UpdateDataModel(biz01_promo)` 동적 DELETE |
| `biz.Biz01_Promo.selectByBuyId` | Biz01_TabPage_List:159 | [`Biz01_Promo.java:111`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByBuyId`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.updateAdd` | Biz01_TabPage_List:176 | [`Biz01_Promo.java:611`](../../biz/services/Biz01_Promo.md) | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md), [`biz02_person.update`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE → [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Biz01_TabPage_List:127 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`bmt01_buy`](../../../db/tables/bmt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_TabPage_List (`client/vi/biz/Biz01_TabPage_List.java`, 253줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 이익제공내역: {insertButton} {updateButton} {deleteButton} {contactPointButton}
- 입력·하위 화면: `providePurComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookuptargetInfo` LookupTriggerField, `lookupCPInfo` Crm09_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - provideDate 100 "제공일자" Date 편집:MyDateField
  - provideContentName 150 "제공품목" TextCenter
  - providePurName 150 "제공목적" TextCenter 편집:providePurComboBox
  - targetCompanyName 200 "상대방 회사명" TextCenter
  - targetEmpName 150 "상대방 성명" TextCenter 편집:lookuptargetInfo
  - note 450 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L66-83) → setting()
[E1] insertButton[등록].Select (L86) → insertRow()
[E2] updateButton[저장].Select (L92) → update()
[E3] deleteButton[삭제].Select (L98) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L225) → 서비스 biz.Biz01_Promo.delete
[E4] contactPointButton[상대처 관리 바로가기].Select (L104) → 인라인 L104-115 (new SelectHandler() { @Override publi…)
[E5] providePurComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L128) → 인라인 L128-134 (new CollapseHandler() { @Override pub…)
[E6] lookuptargetInfo.TriggerClick (L137) → openLookupTargetInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L85-116 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L153-165 | 공개 메서드 | 서비스 biz.Biz01_Promo.selectByBuyId(companyId, buyId) | 업무 |
| public retrieve() | L167-172 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L174-182 | E2 | 서비스 biz.Biz01_Promo.updateAdd | 업무 |
| public insertRow() | L184-205 | E1 | 상태 처리 | 업무 |
| private openLookupTargetInfo() | L207-220 | E6 | 조회창 Crm09_Lookup_SelectSingle 열기 | 업무 |
| public deleteRow() | L222-248 | E3 | ConfirmBox → E7 | 업무 |
| public buildGrid() | L118-151 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L250-252 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('provideDate', 100, '제공일자', { editor: 'date' }),  // L143
  gb.textCenter('provideContentNm', 150, '제공품목'),  // L144
  gb.textCenter('providePurNm', 150, '제공목적', { editor: 'select' }),  // L145
  gb.textCenter('targetCompanyNm', 200, '상대방 회사명'),  // L146
  gb.textCenter('targetEmpNm', 150, '상대방 성명'),  // L147
  gb.text('note', 450, '비고', { editor: 'text' }),  // L148
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="goto" onClick={() => /* 인라인 L104-115 (new SelectHandler() { @Override publi…) */}>상대처 관리 바로가기</Button>

