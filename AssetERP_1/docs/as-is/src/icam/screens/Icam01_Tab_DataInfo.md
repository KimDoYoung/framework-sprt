# Icam01_Tab_DataInfo

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 연계정보구분 관리 (#1095)
- 파일: `client/vi/icam/Icam01_Tab_DataInfo.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam01_DataInfo.delete` | Icam01_Tab_DataInfo:304 | [`Icam01_DataInfo.java:35`](../../icam/services/Icam01_DataInfo.md) | `UpdateDataModel(icam01_data_info)` 동적 DELETE |
| `icam.Icam01_DataInfo.selectBySearchText` | Icam01_Tab_DataInfo:271 | [`Icam01_DataInfo.java:25`](../../icam/services/Icam01_DataInfo.md) | [`icam01_data_info.selectBySearchText`](../../icam/sql/icam01_data_info.md) |
| `icam.Icam01_DataInfo.update` | Icam01_Tab_DataInfo:285 | [`Icam01_DataInfo.java:30`](../../icam/services/Icam01_DataInfo.md) | `UpdateDataModel(icam01_data_info)` 동적 INSERT/UPDATE → [`icam01_data_info.selectById`](../../icam/sql/icam01_data_info.md) |
| `ics.Ics01_ClassTree.selectByClassTreeCode` | Icam01_Tab_DataInfo:243 | [`Ics01_ClassTree.java:147`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByClassTreeCode`](../../ics/sql/ics01_class_tree.md) |
| `sys.Sys09_Code.selectByKindCode` | Icam01_Tab_DataInfo:210 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`icam01_data_info`](../../../db/tables/icam.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam01_Tab_DataInfo (`client/vi/icam/Icam01_Tab_DataInfo.java`, 317줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 코드/명: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `searchText` TextField, `icsCode` TextField, `lookup` Ics01_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스):
  - infoCode 80 "정보코드" TextCenter
  - infoName 250 "정보명" Text
  - trCode 80 "거래코드" TextCenter
  - trName 350 "거래명" Text
  - note 300 "비고" Text 편집:TextField
  - icsClassTreeCode 80 "내부통제코드" Text 편집:icsCode
  - actionCell 30 "" Cell 편집:icsCell
  - icsClassTreeName 400 "법규명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L63-121) → retrieve()
[E1] searchText.KeyPress [Enter] (L66) → retrieve()
[E2] retrieveButton[조회].Select (L75) → retrieve()
[E3] insertButton[등록].Select (L81) → insertRow()
[E4] updateButton[저장].Select (L87) → update()
[E5] deleteButton[삭제].Select (L93) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L298) → 서비스 icam.Icam01_DataInfo.delete
[E6] icsCode.ValueChange (L152) → setIcsClassTreeId()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInfo() | L203-232 | 미사용 후보 | 미선택 시 alert "시스템코드를 확인하여 주십시오.", 서비스 sys.Sys09_Code.selectByKindCode(kindCode, code) | 업무 |
| private setIcsClassTreeId() | L235-264 | E6 | 미선택 시 alert "내부통제코드를 확인하여 주십시오.", 서비스 ics.Ics01_ClassTree.selectByClassTreeCode(classTreeCode) | 업무 |
| public retrieve() | L267-280 | 생성자,E1,E2 | 서비스 icam.Icam01_DataInfo.selectBySearchText(searchText) | 업무 |
| public update() | L283-286 | E4 | 서비스 icam.Icam01_DataInfo.update | 업무 |
| public insertRow() | L289-292 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L295-310 | E5 | ConfirmBox → E7 | 업무 |
| public buildGrid() | L123-200 | 필드 초기화 | 조회창 Ics01_Lookup_SelectMulti 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L312-314 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('infoCd', 80, '정보코드'),  // L190
  gb.text('infoNm', 250, '정보명'),  // L191
  gb.textCenter('trCd', 80, '거래코드'),  // L192
  gb.text('trNm', 350, '거래명'),  // L193
  gb.text('note', 300, '비고', { editor: 'text' }),  // L194
  gb.text('icsClassTreeCd', 80, '내부통제코드'),  // L195 SQL 계산 컬럼(selectBySearchText: ics01_class_tree_cd)
  // ⚠ 대응 없음 (GridBuilder L196) addCell
  gb.text('icsClassTreeNm', 400, '법규명'),  // L197 SQL 계산 컬럼(selectBySearchText: ics01_class_tree_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

