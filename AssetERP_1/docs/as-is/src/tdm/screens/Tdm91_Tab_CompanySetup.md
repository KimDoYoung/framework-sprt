# Tdm91_Tab_CompanySetup

- 종류: 화면
- 메뉴: 책무 > 90. 책무관리현황 > 책무관리 시스템설정 (#1469)
- 파일: `client/vi/tdm/Tdm91_Tab_CompanySetup.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm91_CompanySetup.delete` | Tdm91_Tab_CompanySetup:215 | [`Tdm91_CompanySetup.java:108`](../../tdm/services/Tdm91_CompanySetup.md) | `UpdateDataModel(tdm91_company_setup)` 동적 DELETE |
| `tdm.Tdm91_CompanySetup.selectByCompanyId` | Tdm91_Tab_CompanySetup:133 | [`Tdm91_CompanySetup.java:28`](../../tdm/services/Tdm91_CompanySetup.md) | [`tdm91_company_setup.selectByCompanyId`](../../tdm/sql/tdm91_company_setup.md) |
| `tdm.Tdm91_CompanySetup.update` | Tdm91_Tab_CompanySetup:197 | [`Tdm91_CompanySetup.java:73`](../../tdm/services/Tdm91_CompanySetup.md) | [`tdm91_company_setup.countByDate`](../../tdm/sql/tdm91_company_setup.md), `UpdateDataModel(tdm91_company_setup)` 동적 INSERT/UPDATE → [`tdm91_company_setup.selectById`](../../tdm/sql/tdm91_company_setup.md) |

## 테이블

[`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_create_seq`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm91_Tab_CompanySetup (`client/vi/tdm/Tdm91_Tab_CompanySetup.java`, 226줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {copyButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 120 "적용시작일자" Date 편집:MyDateField
  - cmntMinLimit 150 "의견입력<br>최소 글자수" LongCenter 편집:LongField
  - batchCheckUseYn 150 "일괄점검사용" Boolean
  - batchApprUseYn 150 "일괄승인사용" Boolean
  - evidFileCheckYn 150 "증빙필수" Boolean
  - note 350 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-78) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L81) → retrieve()
[E2] insertButton[등록].Select (L87) → insertRow()
[E3] copyButton[등록(복사)].Select (L93) → copyInsertRow()
[E4] updateButton[저장].Select (L99) → update()
[E5] deleteButton[삭제].Select (L105) → deleteRow()
       └ [E6] messageBox.DialogHide (L208) → 서비스 tdm.Tdm91_CompanySetup.delete(userName)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L128-142 | 생성자,E1 | 서비스 tdm.Tdm91_CompanySetup.selectByCompanyId(companyId) | 업무 |
| public insertRow() | L145-158 | E2 | 상태 처리 | 업무 |
| private copyInsertRow() | L160-176 | E3 | 미선택 시 alert "복사할 대상을 선택하세요" | 업무 |
| public update() | L179-198 | E4 | 서비스 tdm.Tdm91_CompanySetup.update | 업무 |
| public deleteRow() | L201-221 | E5 | ConfirmBox → E6 | 업무 |
| private settings() | L80-111 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L113-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L223-225 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 120, '적용시작일자', { editor: 'date' }),  // L117
  gb.longCenter('cmntMinLimit', 150, '의견입력<br>최소 글자수', { editor: 'number' }),  // L118
  gb.boolean('batchCheckUseYn', 150, '일괄점검사용'),  // L119
  gb.boolean('batchApprUseYn', 150, '일괄승인사용'),  // L120
  gb.boolean('evidFileCheckYn', 150, '증빙필수'),  // L121
  gb.text('note', 350, '비고', { editor: 'text' }),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>

