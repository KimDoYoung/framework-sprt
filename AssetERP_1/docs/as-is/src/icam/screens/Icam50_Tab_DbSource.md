# Icam50_Tab_DbSource

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM DB Source Get (#1269)
- 파일: `client/vi/icam/Icam50_Tab_DbSource.java`
- 함께 쓰는 클래스 1개:
  - `Icam50_Lookup_Source` `client/vi/icam/Icam50_Lookup_Source.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam50_Source.insertIcamDbSource` | Icam50_Tab_DbSource:245 | [`Icam50_Source.java:28`](../../icam/services/Icam50_Source.md) | [`icam50_source.countByStdDate`](../../icam/sql/icam50_source.md), [`icam50_source.insertIcam50`](../../icam/sql/icam50_source.md), [`icam50_source.insertIcamDbSource`](../../icam/sql/icam50_source.md) |
| `icam.Icam50_Source.selectByServerTypePaging` | Icam50_Tab_DbSource:92 | [`Icam50_Source.java:22`](../../icam/services/Icam50_Source.md) | [`icam50_source.selectByServerTypePaging`](../../icam/sql/icam50_source.md), [`icam50_source.selectByServerTypePagingTotal`](../../icam/sql/icam50_source.md) |

## 테이블

[`icam50_source`](../../../db/tables/icam.md), [`icam51_source_tmp`](../../../db/tables/icam.md)

## DB 함수

`f_create_batchseq`, `f_insert_icam50`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam50_Tab_DbSource (`client/vi/icam/Icam50_Tab_DbSource.java`, 282줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 기준일자: {stdDate} 서버: {serverTypeCombo} 소스: {sourceTypeCombo} 검색: {nameSearchField} {sourceSearchField} {retrieveButton} {sourceGetButton}
- 입력·하위 화면: `stdDate` MyDateField, `nameSearchField` TextField 빈칸="소스명", `sourceSearchField` TextField 빈칸="소스내용", `serverTypeCombo` StringComboBox, `sourceTypeCombo` StringComboBox, `lookupSource` Icam50_Lookup_Source
- 그리드 `grid` (buildGrid()):
  - stdDate 100 "기준일" Date
  - serverType 100 "서버" TextCenter
  - owner 100 "OWNER" TextCenter
  - type 120 "구분" TextCenter
  - name 300 "소스명" Text
  - actionCell 50 " " Cell 편집:viewCell
  - lineCnt 100 "라인수" LongCenter
  - workDateString 170 "작업일시" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L62-103) → setting()
[E1] nameSearchField.KeyPress [Enter] (L134) → retrieve()
[E2] sourceSearchField.KeyPress [Enter] (L144) → retrieve()
[E3] retrieveButton[조회].Select (L153) → retrieve()
[E4] sourceGetButton[ICAM DB소스 가져오기].Select [YES] (L160) → getSource()
[E5] msgBox.DialogHide [YES] (L165) → getSource()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L105-182 | 생성자 | 확인창 표시 | 업무 |
| public retrieve() | L209-242 | E1,E2,E3,getSource | 상태 처리 | 업무 |
| private getSource() | L244-259 | E4,E5 | 서비스 icam.Icam50_Source.insertIcamDbSource | 업무 |
| private viewSource() | L261-264 | buildGrid | 조회창 Icam50_Lookup_Source 열기 | 업무 |
| public update() | L267-268 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L271-272 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L275-276 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L184-206 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L278-280 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L196
  gb.textCenter('serverType', 100, '서버'),  // L197
  gb.textCenter('owner', 100, 'OWNER'),  // L198
  gb.textCenter('type', 120, '구분'),  // L199
  gb.text('name', 300, '소스명'),  // L200
  // ⚠ 대응 없음 (GridBuilder L201) addCell
  gb.longCenter('lineCnt', 100, '라인수'),  // L202
  gb.textCenter('workDateString', 170, '작업일시'),  // L203 SQL 계산 컬럼(selectByServerTypePaging: to_char(icam50_work_date,'yyyy-mm-dd HH…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={getSource}>ICAM DB소스 가져오기</Button>

### Icam50_Lookup_Source (`client/vi/icam/Icam50_Lookup_Source.java`, 54줄)

- 입력·하위 화면: `sourceText` MyTextArea

#### 이벤트
[E1] closeButton[닫기].Select (L38) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L23-48 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L50-52 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

