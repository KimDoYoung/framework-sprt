# Emp93_Lookup_SmsNoticeTarget

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `flt`, `ics`
- 파일: `client/vi/emp/Emp93_Lookup_SmsNoticeTarget.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp93_SmsNoticeTarget.delete` | Emp93_Lookup_SmsNoticeTarget:197 | [`Emp93_SmsNoticeTarget.java:43`](../../emp/services/Emp93_SmsNoticeTarget.md) | `UpdateDataModel(emp93_sms_notice_target)` 동적 DELETE |
| `emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode` | Emp93_Lookup_SmsNoticeTarget:132 | [`Emp93_SmsNoticeTarget.java:24`](../../emp/services/Emp93_SmsNoticeTarget.md) | [`emp93_sms_notice_target.selectBySmsNoticeCode`](../../emp/sql/emp93_sms_notice_target.md) |
| `emp.Emp93_SmsNoticeTarget.update` | Emp93_Lookup_SmsNoticeTarget:144 | [`Emp93_SmsNoticeTarget.java:38`](../../emp/services/Emp93_SmsNoticeTarget.md) | `UpdateDataModel(emp93_sms_notice_target)` 동적 INSERT/UPDATE → [`emp93_sms_notice_target.selectById`](../../emp/sql/emp93_sms_notice_target.md) |

## 테이블

[`emp93_sms_notice_target`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp93_Lookup_SmsNoticeTarget (`client/vi/emp/Emp93_Lookup_SmsNoticeTarget.java`, 203줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personInfo 250 "사원" Text
  - note 250 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L59-84) → settings(), show()
[E1] retrieveButton[조회].Select (L87) → retrieve()
[E2] insertButton[등록].Select (L93) → insertRow()
[E3] updateButton[저장].Select (L99) → update()
[E4] deleteButton[삭제].Select (L105) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L177) → deleteRow()
[E5] cancelButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-57 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L127-139 | E1,open | 서비스 emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode(companyId, smsNoticeCode) | 업무 |
| public update() | L141-145 | E3 | 서비스 emp.Emp93_SmsNoticeTarget.update(personId) | 업무 |
| public insertRow() | L147-172 | E2 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteChk() | L174-192 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L194-198 | E6 | GridDeleteData emp.Emp93_SmsNoticeTarget.delete(체크된 행 목록) | 업무 |
| private settings() | L86-117 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personInfo', 250, '사원'),  // L122 SQL 계산 컬럼(selectBySmsNoticeCode: ( f_emp_kor_nm(emp93_person_id)||' ('||…)
  gb.text('note', 250, '비고', { editor: 'text' }),  // L123
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

